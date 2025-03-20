# import os
# import pickle
# from deepface import DeepFace
# import cv2
# from scipy.spatial.distance import cosine
# import time

# # Paths
# filtered_frames_path = "FaceTrack/Backend/model/filtered_frames"
# EMBEDDINGS_FILE = "FaceTrack/Backend/model/embeddings.pkl"
# LOG_FILE = "FaceTrack/Backend/model/recognition_log.txt"

# # Load precomputed embeddings
# if os.path.exists(EMBEDDINGS_FILE):
#     with open(EMBEDDINGS_FILE, "rb") as f:
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

# # Function to log results
# def log_result(frame_name, identity):
#     log_message = f"Frame {frame_name}: Recognized as {identity}"
#     print(log_message)
#     with open(LOG_FILE, "a") as log_file:
#         log_file.write(log_message + "\n")

# # Set of already processed frames
# processed_frames = set()

# # Continuous monitoring loop
# print("Starting continuous monitoring of filtered frames...")
# while True:
#     for frame_name in os.listdir(filtered_frames_path):
#         if frame_name in processed_frames:
#             continue

#         frame_path = os.path.join(filtered_frames_path, frame_name)

#         image = cv2.imread(frame_path)
#         if image is None:
#             print(f"Could not read frame: {frame_name}")
#             continue

#         try:
#             results = DeepFace.represent(img_path=frame_path, model_name="Facenet", enforce_detection=False)

#             if not results:  # If no faces are detected
#                 print(f"No face detected in {frame_name}")
#                 continue

#             for result in results:
#                 embedding = result["embedding"]
#                 identity = recognize_face(embedding)
#                 log_result(frame_name, identity)

#             # Mark frame as processed
#             processed_frames.add(frame_name)

#         except Exception as e:
#             print(f"Error processing {frame_name}: {e}")

#     # Wait for a while before checking again
#     time.sleep(5)  # Adjust the sleep time as needed



import os
import pickle
from deepface import DeepFace
import cv2
from scipy.spatial.distance import cosine
import time

# Paths
filtered_frames_path = "FaceTrack/Backend/model/filtered_frames"
embeddings_file = "FaceTrack/Backend/model/embeddings.pkl"
log_file = "FaceTrack/Backend/model/recognition_log.txt"

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

# Function to log results
def log_result(camera, frame_name, identity):
    log_message = f"{camera} - Frame {frame_name}: Recognized as {identity}"
    print(log_message)
    with open(log_file, "a") as log:
        log.write(log_message + "\n")

# Set of already processed frames for both cameras
processed_frames = {"camera_1": set(), "camera_2": set()}

# Function to process frames for each camera
def process_frames(camera):
    camera_path = os.path.join(filtered_frames_path, camera)

    if not os.path.exists(camera_path):
        return

    for frame_name in os.listdir(camera_path):
        if frame_name in processed_frames[camera]:
            continue

        frame_path = os.path.join(camera_path, frame_name)

        image = cv2.imread(frame_path)
        if image is None:
            print(f"Could not read frame: {frame_name}")
            continue

        try:
            results = DeepFace.represent(img_path=frame_path, model_name="Facenet", enforce_detection=False)

            if not results:  # If no faces are detected
                print(f"No face detected in {frame_name}")
                continue

            for result in results:
                embedding = result["embedding"]
                identity = recognize_face(embedding)
                log_result(camera, frame_name, identity)

            # Mark frame as processed
            processed_frames[camera].add(frame_name)

        except Exception as e:
            print(f"Error processing {frame_name}: {e}")

# Continuous monitoring loop for both cameras
print("Starting continuous monitoring of filtered frames...")

while True:
    for camera in ["camera_1", "camera_2"]:
        process_frames(camera)

    # Wait for a while before checking again
    time.sleep(5)  # Adjust sleep time if needed