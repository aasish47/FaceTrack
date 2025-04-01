import cv2
import os
import shutil
import time
import django
import sys
from django.db import connection

# Initialize Django environment (same as your capture script)
PROJECT_ROOT = r'/Volumes/Keiko/FaceTrack/FaceTrack1/FaceTrack/Backend/FaceRecognitionBackend'
sys.path.append(PROJECT_ROOT)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognitionBackend.settings')

try:
    django.setup()
    from Camera.models import Camera
except Exception as e:
    print(f"Failed to initialize Django: {e}")
    sys.exit(1)

# Initialize model paths
model_path = 'FaceTrack1/FaceTrack/Backend/model/deploy.prototxt.txt'
weights_path = "FaceTrack1/FaceTrack/Backend/model/res10_300x300_ssd_iter_140000.caffemodel"
input_directory = "FaceTrack1/FaceTrack/Backend/model/captured_frames"
output_directory = "FaceTrack1/FaceTrack/Backend/model/filtered_frames"

# Load the face detection model
net = cv2.dnn.readNetFromCaffe(model_path, weights_path)

def get_operational_cameras():
    """Fetch all operational cameras from database with connection handling"""
    try:
        # Ensure database connection is alive
        connection.ensure_connection()
        return Camera.objects.filter(operational=True)
    except Exception as e:
        print(f"Database error fetching cameras: {e}")
        return []

def ensure_camera_directories(cameras):
    """Create input/output directories for all cameras"""
    for camera in cameras:
        # Create camera-specific directories
        cam_input_dir = os.path.join(input_directory, f"camera_{camera.id}")
        cam_output_dir = os.path.join(output_directory, f"camera_{camera.id}")
        
        os.makedirs(cam_input_dir, exist_ok=True)
        os.makedirs(cam_output_dir, exist_ok=True)
        print(f"Ensured directories exist for camera_{camera.id}")

def detect_faces_dnn(image_path, net, conf_threshold=0.5):
    """Detect faces in an image using DNN model"""
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
            return True  # Face detected

    return False  # No face detected

def filter_frames_dnn():
    """Main function to filter frames from all operational cameras"""
    processed_files = {}  # Dictionary to track processed files per camera
    
    while True:
        # Get current operational cameras from database
        cameras = get_operational_cameras()
        if not cameras:
            print("No operational cameras found, retrying in 10 seconds...")
            time.sleep(10)
            continue

        # Ensure directories exist for all cameras
        ensure_camera_directories(cameras)

        # Initialize processed files tracking for new cameras
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

        # Sleep to avoid constant polling
        time.sleep(1)

if __name__ == "__main__":
    print("Starting face detection process...")
    filter_frames_dnn()