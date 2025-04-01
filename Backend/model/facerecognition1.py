import os
import pickle
from deepface import DeepFace
import cv2
from scipy.spatial.distance import cosine
import time
import requests
import json

# Paths
filtered_frames_path = "FaceTrack1/FaceTrack/Backend/model/filtered_frames"
embeddings_file = "FaceTrack1/FaceTrack/Backend/model/embeddings.pkl"
log_file = "FaceTrack1/FaceTrack/Backend/model/recognition_log.txt"

# Load precomputed embeddings
if os.path.exists(embeddings_file):
    with open(embeddings_file, "rb") as f:
        known_embeddings = pickle.load(f)
    print("Loaded precomputed embeddings.")
else:
    print("Error: Embeddings file not found!")
    exit(1)

# Function to recognize faces using cosine similarity
def recognize_face(embedding, threshold=0.6):
    identity = "Unknown"
    min_distance = float("inf")

    for name, known_embedding in known_embeddings.items():
        distance = cosine(embedding, known_embedding)
        if distance < threshold and distance < min_distance:
            min_distance = distance
            identity = name

    return identity

DJANGO_API_URL = "http://127.0.0.1:8000/attendance/mark-attendance/"

last_detection_time = {}

def log_result(camera, frame_name, identity, frame_path):
    current_time = time.time()

    if camera not in last_detection_time:
        last_detection_time[camera] = {}

    if identity != "Unknown":
        if identity in last_detection_time[camera] and current_time - last_detection_time[camera][identity] < 180:
            print(f"Skipping {identity} in {camera}, detected recently. Deleting frame {frame_name}...")
            os.remove(frame_path)  
            return

        last_detection_time[camera][identity] = current_time

        data = {"user_id": identity, "camera": camera}
        headers = {"Content-Type": "application/json"}
        try:
            response = requests.post(DJANGO_API_URL, json=data, headers=headers)
            print(f"Attendance Response ({identity} in {camera}):", response.status_code, response.text)
        except requests.RequestException as e:
            print(f"Error sending attendance for {identity} in {camera}: {e}")

    log_message = f"{camera} - Frame {frame_name}: Recognized as {identity}"
    print(log_message)
    with open(log_file, "a") as log:
        log.write(log_message + "\n")

    if os.path.exists(frame_path):
        os.remove(frame_path)
        print(f"Deleted processed frame: {frame_path}")

processed_frames = {}

def process_frames(camera):
    camera_path = os.path.join(filtered_frames_path, camera)

    if not os.path.exists(camera_path):
        return

    if camera not in processed_frames:
        processed_frames[camera] = set()

    for frame_name in os.listdir(camera_path):
        frame_path = os.path.join(camera_path, frame_name)

        if frame_name in processed_frames[camera]:
            print(f"Skipping already processed frame {frame_name} for {camera}. Deleting it...")
            os.remove(frame_path)  
            continue

        image = cv2.imread(frame_path)
        if image is None:
            print(f"Could not read frame: {frame_name}")
            os.remove(frame_path)  
            continue

        try:
            results = DeepFace.represent(img_path=frame_path, model_name="Facenet", enforce_detection=False)

            if not results:
                print(f"No face detected in {frame_name}. Deleting frame...")
                os.remove(frame_path)  
                continue

            for result in results:
                embedding = result.get("embedding")
                if embedding is None:
                    print(f"Error: No embedding found for {frame_name}. Deleting frame...")
                    os.remove(frame_path)
                    continue

                identity = recognize_face(embedding)
                log_result(camera, frame_name, identity, frame_path)

            processed_frames[camera].add(frame_name)

        except Exception as e:
            print(f"Error processing {frame_name}: {e}")

print("Starting continuous monitoring of filtered frames...")

import sys

folder_path = sys.path[0]+'/filtered_frames'

folder_names = [folder for folder in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, folder))]

while True:
    for camera in folder_names:
        process_frames(camera)
        
        time.sleep(5)

# while True:
#     for camera in ["camera_10", "camera_2"]:
#         process_frames(camera)

#     time.sleep(5)