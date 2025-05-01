# import os
# import pickle
# from deepface import DeepFace
# import cv2
# from scipy.spatial.distance import cosine
# import time
# import requests
# import json
# import sys

# def find_relative_path(root_dir, target_name):
#     for root, dirs, files in os.walk(root_dir):
#         if target_name in files or target_name in dirs:
#             return os.path.relpath(os.path.join(root, target_name), start=root_dir)
#     return None

# root_directory = os.getcwd()  

# # here paths are made by using the find_relative_path function above
# filtered_frames_path = find_relative_path(root_directory, 'filtered_frames')
# embeddings_file = find_relative_path(root_directory, "embeddings.pkl")
# log_file = find_relative_path(root_directory, "recognition_log.txt")



# # loading the  precomputed embeddings
# if os.path.exists(embeddings_file):
#     with open(embeddings_file, "rb") as f:
#         known_embeddings = pickle.load(f)
#     print("Loaded precomputed embeddings.")
# else:
#     print("Error: Embeddings file not found!")
#     exit(1)

# # Function to recognize faces using cosine similarity 
# def recognize_face(embedding, threshold=0.6):
#     identity = "Unknown"
#     min_distance = float("inf")

#     for name, known_embedding in known_embeddings.items():
#         distance = cosine(embedding, known_embedding)
#         if distance < threshold and distance < min_distance:
#             min_distance = distance
#             identity = name

#     return identity

# DJANGO_API_URL = "http://127.0.0.1:8000/attendance/mark-attendance/"

# last_detection_time = {}

# def log_result(camera, frame_name, identity, frame_path):
#     current_time = time.time()

#     if camera not in last_detection_time:
#         last_detection_time[camera] = {}

#     if identity != "Unknown":
#         if identity in last_detection_time[camera] and current_time - last_detection_time[camera][identity] < 180:
#             print(f"Skipping {identity} in {camera}, detected recently. Deleting frame {frame_name}...")
#             os.remove(frame_path)  
#             return

#         last_detection_time[camera][identity] = current_time

#         data = {"user_id": identity, "camera": camera}
#         headers = {"Content-Type": "application/json"}
#         try:
#             response = requests.post(DJANGO_API_URL, json=data, headers=headers)
#             print(f"Attendance Response ({identity} in {camera}):", response.status_code, response.text)
#         except requests.RequestException as e:
#             print(f"Error sending attendance for {identity} in {camera}: {e}")

#     log_message = f"{camera} - Frame {frame_name}: Recognized as {identity}"
#     print(log_message)
#     with open(log_file, "a") as log:
#         log.write(log_message + "\n")

#     if os.path.exists(frame_path):
#         os.remove(frame_path)
#         print(f"Deleted processed frame: {frame_path}")

# processed_frames = {}

# def process_frames(camera):
#     camera_path = os.path.join(filtered_frames_path, camera)

#     if not os.path.exists(camera_path):
#         return

#     if camera not in processed_frames:
#         processed_frames[camera] = set()

#     for frame_name in os.listdir(camera_path):
#         frame_path = os.path.join(camera_path, frame_name)

#         if frame_name in processed_frames[camera]:
#             print(f"Skipping already processed frame {frame_name} for {camera}. Deleting it...")
#             os.remove(frame_path)  
#             continue

#         image = cv2.imread(frame_path)
#         if image is None:
#             print(f"Could not read frame: {frame_name}")
#             os.remove(frame_path)  
#             continue

#         try:
#             results = DeepFace.represent(img_path=frame_path, model_name="Facenet", enforce_detection=False)

#             if not results:
#                 print(f"No face detected in {frame_name}. Deleting frame...")
#                 os.remove(frame_path)  
#                 continue

#             for result in results:
#                 embedding = result.get("embedding")
#                 if embedding is None:
#                     print(f"Error: No embedding found for {frame_name}. Deleting frame...")
#                     os.remove(frame_path)
#                     continue

#                 identity = recognize_face(embedding)
#                 log_result(camera, frame_name, identity, frame_path)

#             processed_frames[camera].add(frame_name)

#         except Exception as e:
#             print(f"Error processing {frame_name}: {e}")

# print("Starting continuous monitoring of filtered frames...")



# folder_path = sys.path[0]+'/filtered_frames'

# folder_names = [folder for folder in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, folder))]

# while True:
#     for camera in folder_names:
#         process_frames(camera)
        
#         time.sleep(5)


import os
import pickle
import cv2
import time
import requests
import numpy as np
import sys
from insightface.app import FaceAnalysis

def find_relative_path(root_dir, target_name):
    for root, dirs, files in os.walk(root_dir):
        if target_name in files or target_name in dirs:
            return os.path.relpath(os.path.join(root, target_name), start=root_dir)
    return None

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

root_directory = os.getcwd()

filtered_frames_path = find_relative_path(root_directory, 'filtered_frames')
embeddings_file = find_relative_path(root_directory, "embeddings.pkl")
log_file = find_relative_path(root_directory, "recognition_log.txt")

# Load face embeddings
if os.path.exists(embeddings_file):
    with open(embeddings_file, "rb") as f:
        known_embeddings = pickle.load(f)
    print("Loaded precomputed embeddings.")
else:
    print("Error: Embeddings file not found!")
    exit(1)

# Initialize FaceAnalysis (ArcFace)
app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=0)  # ctx_id=0 uses CPU; set to -1 for GPU

# Recognition logic
def recognize_face(embedding, threshold=0.4):
    identity = "Unknown"
    max_score = -1
    for name, known_embedding in known_embeddings.items():
        score = cosine_similarity(embedding, known_embedding)
        if score > threshold and score > max_score:
            max_score = score
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
            faces = app.get(image)
            if not faces:
                print(f"No face detected in {frame_name}. Deleting frame...")
                os.remove(frame_path)
                continue

            for face in faces:
                embedding = face.embedding
                if embedding is None:
                    print(f"Error: No embedding found for {frame_name}. Deleting frame...")
                    os.remove(frame_path)
                    continue

                identity = recognize_face(embedding)
                log_result(camera, frame_name, identity, frame_path)

            processed_frames[camera].add(frame_name)

        except Exception as e:
            print(f"Error processing {frame_name}: {e}")

# Monitor continuously
print("Starting continuous monitoring of filtered frames...")

folder_path = sys.path[0] + '/filtered_frames'
folder_names = [folder for folder in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, folder))]

while True:
    for camera in folder_names:
        process_frames(camera)
        time.sleep(5)