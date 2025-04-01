import cv2
import os
import shutil
import time
import django
import sys
from django.db import connection


# here also we need the absolute path of the folder so i have done it in the same way as in videoprocessing
PROJECT_ROOT = os.path.dirname(sys.path[0])+'/FaceRecognitionBackend'

sys.path.append(PROJECT_ROOT)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognitionBackend.settings')

try:
    django.setup()
    from Camera.models import Camera
except Exception as e:
    print(f"Failed to initialize Django: {e}")
    sys.exit(1)



def find_relative_path(root_dir, target_name):
    for root, dirs, files in os.walk(root_dir):
        if target_name in files or target_name in dirs:
            return os.path.relpath(os.path.join(root, target_name), start=root_dir)
    return None

root_directory = os.getcwd()  

model_path=find_relative_path(root_directory, 'deploy.prototxt.txt')
weights_path = find_relative_path(root_directory, "res10_300x300_ssd_iter_140000.caffemodel")
input_directory =find_relative_path(root_directory, "captured_frames")
output_directory =find_relative_path(root_directory, "filtered_frames")


# Resnet model used
# model_path = 'FaceTrack1/FaceTrack/Backend/model/deploy.prototxt.txt'
# weights_path = "FaceTrack1/FaceTrack/Backend/model/res10_300x300_ssd_iter_140000.caffemodel"
# input_directory = "FaceTrack1/FaceTrack/Backend/model/captured_frames"
# output_directory = "FaceTrack1/FaceTrack/Backend/model/filtered_frames"

net = cv2.dnn.readNetFromCaffe(model_path, weights_path)

def get_operational_cameras():
    try:
        # Ensure database connection is alive
        connection.ensure_connection()
        return Camera.objects.filter(operational=True)
    except Exception as e:
        print(f"Database error fetching cameras: {e}")
        return []

def ensure_camera_directories(cameras):
    for camera in cameras:
        # Create camera-specific directories
        cam_input_dir = os.path.join(input_directory, f"camera_{camera.id}")
        cam_output_dir = os.path.join(output_directory, f"camera_{camera.id}")
        
        os.makedirs(cam_input_dir, exist_ok=True)
        os.makedirs(cam_output_dir, exist_ok=True)
        print(f"Ensured directories exist for camera_{camera.id}")

def detect_faces_dnn(image_path, net, conf_threshold=0.5):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not load image {image_path}.")
        return False

    try:
        blob = cv2.dnn.blobFromImage(image, scalefactor=1.0, size=(300, 300), 
                                   mean=(104.0, 177.0, 123.0), swapRB=False, crop=False)
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
            # when face is detected it will return true
            return True  

    return False

def filter_frames_dnn():
    processed_files = {}  
    
    while True:
        cameras = get_operational_cameras()
        if not cameras:
            print("No operational cameras found, retrying in 10 seconds...")
            time.sleep(10)
            continue
        ensure_camera_directories(cameras)


        for camera in cameras:
            cam_id = f"camera_{camera.id}"
            if cam_id not in processed_files:
                processed_files[cam_id] = set()

        # Process frames for each camera
        for camera in cameras:
            cam_id = f"camera_{camera.id}"
            camera_input_dir = os.path.join(input_directory, cam_id)
            camera_output_dir = os.path.join(output_directory, cam_id)

            if not os.path.exists(camera_input_dir):
                print(f"Input directory not found for {cam_id}")
                continue

            try:
                files = os.listdir(camera_input_dir)
            except OSError as e:
                print(f"Error accessing directory {camera_input_dir}: {e}")
                continue

            for filename in files:
                if filename in processed_files[cam_id]:
                    continue

                input_path = os.path.join(camera_input_dir, filename)
                if not os.path.isfile(input_path):
                    continue

                print(f"Processing {cam_id}/{filename}...")
                try:
                    if detect_faces_dnn(input_path, net):
                        output_path = os.path.join(camera_output_dir, filename)
                        shutil.copy(input_path, output_path)
                        print(f"Face detected: {filename} -> Copied to {cam_id}")
                    else:
                        print(f"No face detected: {filename}")

                    processed_files[cam_id].add(filename)
                    os.remove(input_path)
                    print(f"Deleted: {filename}")
                except Exception as e:
                    print(f"Error processing {filename}: {e}")

        # Sleep is necessary in these kind of situations to avoid constant polling
        
        # constant polling means repeatedly checking for a condition without any delay, 
        # which can lead to high CPU usage and unnecessary resource consumption. 
        # Adding a sleep interval helps reduce system load and improves efficiency.
        # so sleep is necessary
        time.sleep(1)

if __name__ == "__main__":
    print("Starting face detection process...")
    filter_frames_dnn()