# import os
# import cv2
# import numpy as np
# import torch
# from torchvision import transforms
# from PIL import Image
# from datetime import datetime
# import subprocess
# import shutil
#
# # Import your custom functions
# from videoprocessing import capture_frames_with_ffmpeg
# from liveness import DeePixBiS, load_model, preprocess_frame, check_liveness
# from facedetection import detect_faces_dnn, filter_frames_dnn
#
# # Initialize paths and parameters
# camera_url = "http://192.168.29.207:8080/video"  # Replace with your camera URL
# output_dir = "captured_frames"  # Directory to save captured frames
# filtered_dir = "filtered_frames"  # Directory to save frames with detected faces
# model_path = "./Face-Anti-Spoofing-using-DeePixBis/DeePixBiS.pth"  # Path to DeePixBiS model
# face_detection_model_path = "deploy.prototxt.txt"  # Path to face detection prototxt
# face_detection_weights_path = "res10_300x300_ssd_iter_140000.caffemodel"  # Path to face detection weights
#
# # Ensure output directories exist
# os.makedirs(output_dir, exist_ok=True)
# os.makedirs(filtered_dir, exist_ok=True)
#
# # Load the DeePixBiS model for liveness detection
# liveness_model = load_model(model_path)
#
# # Load the face detection model
# face_detection_net = cv2.dnn.readNetFromCaffe(face_detection_model_path, face_detection_weights_path)
#
# def main():
#     # Step 1: Capture frames from the camera feed
#     print("Starting video processing...")
#     capture_frames_with_ffmpeg(camera_url, output_dir, fps=1)
#
#     # Step 2: Detect faces in the captured frames
#     print("Detecting faces in captured frames...")
#     filter_frames_dnn(output_dir, filtered_dir, face_detection_net, confidence_threshold=0.5)
#
#     # Step 3: Perform liveness detection on detected faces
#     print("Performing liveness detection...")
#     for filename in os.listdir(filtered_dir):
#         if filename.endswith(('.jpg', '.jpeg', '.png')):
#             frame_path = os.path.join(filtered_dir, filename)
#             frame = cv2.imread(frame_path)
#
#             if frame is not None:
#                 # Preprocess the frame for liveness detection
#                 preprocessed_frame = preprocess_frame(frame)
#
#                 # Perform liveness detection
#                 liveness_score = check_liveness(liveness_model, preprocessed_frame)
#                 result = "Real" if liveness_score >= 0.8 else "Spoof"
#
#                 # Print the result
#                 print(f"Frame: {filename}, Liveness Score: {liveness_score:.4f}, Result: {result}")
#
#                 # Step 4: Perform face recognition (if the face is real)
#                 if result == "Real":
#                     # Add your face recognition logic here
#                     # Example: recognize_face(frame)
#                     print(f"Performing face recognition on {filename}...")
#
#     print("Pipeline execution completed.")
#
# if __name__ == "__main__":
#     main()




import subprocess
import threading
import os

BASE_DIR = "/Volumes/Keiko/Django/model"

scripts = [
    os.path.join(BASE_DIR, "videoprocessing.py"),
    os.path.join(BASE_DIR, "facedetection.py"),
    os.path.join(BASE_DIR, "facerecognition1.py")
]

delete_old_frames_script = os.path.join(BASE_DIR, "delete_frames.py")

def run_script(script_path):
    """Runs a Python script as a subprocess."""
    try:
        subprocess.run(["python3", script_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_path}: {e}")

# Start all scripts as separate threads
threads = [threading.Thread(target=run_script, args=(script,), daemon=True) for script in scripts]

# Start the delete_old_frames script in parallel
delete_thread = threading.Thread(target=run_script, args=(delete_old_frames_script,), daemon=True)
delete_thread.start()

# Start and join all threads
for thread in threads:
    thread.start()

for thread in threads:
    thread.join()

delete_thread.join()

print("Pipeline execution completed.")