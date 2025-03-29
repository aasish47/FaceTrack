# import cv2
# import os
# import numpy as np
# import shutil
# import time

# # Initialize model paths (you should have these files)
# model_path = 'FaceTrack/Backend/model/deploy.prototxt.txt'  # Path to the .prototxt file
# weights_path = "FaceTrack/Backend/model/res10_300x300_ssd_iter_140000.caffemodel"  # Path to the pre-trained weights file
# input_directory = "FaceTrack/Backend/model/captured_frames"  # Directory where captured frames are stored
# output_directory = "FaceTrack/Backend/model/filtered_frames"  # Directory to store frames with faces

# # Ensure output directory exists
# if not os.path.exists(output_directory):
#     os.makedirs(output_directory)

# # Load the face detection model
# net = cv2.dnn.readNetFromCaffe(model_path, weights_path)

# # Function to detect faces in a frame using DNN model
# def detect_faces_dnn(image_path, net, conf_threshold=0.5):
#     # Load the image
#     image = cv2.imread(image_path)
#     if image is None:
#         print(f"Error: Could not load image {image_path}.")
#         return False

#     # Resize and normalize the image as expected by the model
#     try:
#         blob = cv2.dnn.blobFromImage(image, scalefactor=1.0, size=(300, 300), mean=(104.0, 177.0, 123.0), swapRB=False, crop=False)
#         if blob.size == 0:
#             print("Error: Blob is empty!")
#             return False
#     except Exception as e:
#         print(f"Error creating blob: {e}")
#         return False

#     # Set the blob as input to the network
#     net.setInput(blob)
#     print("Blob shape:", blob.shape)

#     # Perform forward pass and handle exceptions
#     try:
#         detections = net.forward()
#     except cv2.error as e:
#         print(f"Error during forward pass: {e}")
#         return False

#     # Process detections
#     (h, w) = image.shape[:2]
#     for i in range(detections.shape[2]):
#         confidence = detections[0, 0, i, 2]
#         if confidence > conf_threshold:
#             box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#             (startX, startY, endX, endY) = box.astype("int")
#             return True  # Face detected

#     return False  # No face detected


# # Function to filter frames based on face detection
# def filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5):
#     # Track processed files to avoid reprocessing
#     processed_files = set()

#     while True:
#         # Get the list of files in the input directory
#         files = os.listdir(input_directory)

#         # Iterate over all images in the input directory
#         for filename in files:
#             input_path = os.path.join(input_directory, filename)

#             # Skip if the file has already been processed
#             if filename in processed_files:
#                 continue

#             if os.path.isfile(input_path):
#                 print(f"Processing {filename}...")
#                 try:
#                     # Detect faces in the frame
#                     if detect_faces_dnn(input_path, net, confidence_threshold):
#                         # If face detected, copy the frame to the output directory
#                         output_path = os.path.join(output_directory, filename)
#                         shutil.copy(input_path, output_path)
#                         print(f"Face detected: {filename} - Copied to filtered_frames")
#                     else:
#                         print(f"No face detected: {filename}")

#                     # Mark the file as processed
#                     processed_files.add(filename)

#                 except Exception as e:
#                     print(f"Error during face detection: {e}")
#             else:
#                 print(f"Skipping non-image file: {filename}")

#         # Wait for a short period before checking for new files again
#         time.sleep(1)  # Adjust the sleep time as needed

# # Call the function to filter frames
# filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5)







# import cv2
# import os
# import numpy as np
# import shutil
# import time

# # Initialize model paths (you should have these files)
# model_path = 'FaceTrack1/FaceTrack/Backend/model/deploy.prototxt.txt'  # Path to the .prototxt file
# weights_path = "FaceTrack1/FaceTrack/Backend/model/res10_300x300_ssd_iter_140000.caffemodel"  # Path to the pre-trained weights file
# input_directory = "FaceTrack1/FaceTrack/Backend/model/captured_frames"  # Directory where captured frames are stored
# output_directory = "FaceTrack1/FaceTrack/Backend/model/filtered_frames"  # Directory to store frames with faces

# # Ensure output directories exist for both cameras
# camera_1_output = os.path.join(output_directory, "camera_1")
# camera_2_output = os.path.join(output_directory, "camera_2")
# os.makedirs(camera_1_output, exist_ok=True)
# os.makedirs(camera_2_output, exist_ok=True)

# # Load the face detection model
# net = cv2.dnn.readNetFromCaffe(model_path, weights_path)

# # Function to detect faces in a frame using DNN model
# def detect_faces_dnn(image_path, net, conf_threshold=0.5):
#     image = cv2.imread(image_path)
#     if image is None:
#         print(f"Error: Could not load image {image_path}.")
#         return False

#     try:
#         blob = cv2.dnn.blobFromImage(image, scalefactor=1.0, size=(300, 300), mean=(104.0, 177.0, 123.0), swapRB=False, crop=False)
#         if blob.size == 0:
#             print("Error: Blob is empty!")
#             return False
#     except Exception as e:
#         print(f"Error creating blob: {e}")
#         return False

#     net.setInput(blob)

#     try:
#         detections = net.forward()
#     except cv2.error as e:
#         print(f"Error during forward pass: {e}")
#         return False

#     (h, w) = image.shape[:2]
#     for i in range(detections.shape[2]):
#         confidence = detections[0, 0, i, 2]
#         if confidence > conf_threshold:
#             box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#             (startX, startY, endX, endY) = box.astype("int")
#             return True  # Face detected

#     return False  # No face detected

# # Function to filter frames from both cameras
# def filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5):
#     processed_files = {"camera_1": set(), "camera_2": set()}

#     while True:
#         for camera in ["camera_1", "camera_2"]:
#             camera_input_dir = os.path.join(input_directory, camera)
#             camera_output_dir = os.path.join(output_directory, camera)

#             if not os.path.exists(camera_input_dir):
#                 continue

#             files = os.listdir(camera_input_dir)

#             for filename in files:
#                 input_path = os.path.join(camera_input_dir, filename)

#                 if filename in processed_files[camera]:
#                     continue

#                 if os.path.isfile(input_path):
#                     print(f"Processing {camera}/{filename}...")
#                     try:
#                         if detect_faces_dnn(input_path, net, confidence_threshold):
#                             output_path = os.path.join(camera_output_dir, filename)
#                             shutil.copy(input_path, output_path)
#                             print(f"Face detected: {filename} -> Copied to {camera}")
#                         else:
#                             print(f"No face detected: {filename}")

#                         processed_files[camera].add(filename)

#                     except Exception as e:
#                         print(f"Error during face detection: {e}")

#         # Sleep to avoid constant polling
#         time.sleep(1)

# # Start filtering frames from both cameras
# filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5)





import cv2
import os
import numpy as np
import shutil
import time

# Initialize model paths
model_path = 'FaceTrack1/FaceTrack/Backend/model/deploy.prototxt.txt'
weights_path = "FaceTrack1/FaceTrack/Backend/model/res10_300x300_ssd_iter_140000.caffemodel"
input_directory = "FaceTrack1/FaceTrack/Backend/model/captured_frames"
output_directory = "FaceTrack1/FaceTrack/Backend/model/filtered_frames"

# Ensure output directories exist for both cameras
camera_1_output = os.path.join(output_directory, "camera_1")
camera_2_output = os.path.join(output_directory, "camera_2")
os.makedirs(camera_1_output, exist_ok=True)
os.makedirs(camera_2_output, exist_ok=True)

# Load the face detection model
net = cv2.dnn.readNetFromCaffe(model_path, weights_path)

# Function to detect faces in a frame using DNN model
def detect_faces_dnn(image_path, net, conf_threshold=0.5):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image {image_path}.")
        return False

    try:
        blob = cv2.dnn.blobFromImage(image, scalefactor=1.0, size=(300, 300), mean=(104.0, 177.0, 123.0), swapRB=False, crop=False)
        if blob.size == 0:
            print("Error: Blob is empty!")
            return False
    except Exception as e:
        print(f"Error creating blob: {e}")
        return False

    net.setInput(blob)

    try:
        detections = net.forward()
    except cv2.error as e:
        print(f"Error during forward pass: {e}")
        return False

    (h, w) = image.shape[:2]
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            return True  # Face detected

    return False  # No face detected

# Function to filter frames from both cameras
def filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5):
    processed_files = {"camera_1": set(), "camera_2": set()}

    while True:
        for camera in ["camera_1", "camera_2"]:
            camera_input_dir = os.path.join(input_directory, camera)
            camera_output_dir = os.path.join(output_directory, camera)

            if not os.path.exists(camera_input_dir):
                continue

            files = os.listdir(camera_input_dir)

            for filename in files:
                input_path = os.path.join(camera_input_dir, filename)

                if filename in processed_files[camera]:
                    continue

                if os.path.isfile(input_path):
                    print(f"Processing {camera}/{filename}...")
                    try:
                        if detect_faces_dnn(input_path, net, confidence_threshold):
                            output_path = os.path.join(camera_output_dir, filename)
                            shutil.copy(input_path, output_path)
                            print(f"Face detected: {filename} -> Copied to {camera}")
                        else:
                            print(f"No face detected: {filename}")

                        processed_files[camera].add(filename)
                        
                        # Delete the processed file
                        os.remove(input_path)
                        print(f"Deleted: {filename}")
                    except Exception as e:
                        print(f"Error during face detection: {e}")

        # Sleep to avoid constant polling
        time.sleep(1)

# Start filtering frames from both cameras
filter_frames_dnn(input_directory, output_directory, net, confidence_threshold=0.5)
