import os
import sys
import subprocess
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import django

# Absolute path to your Django project root (FaceRecognitionBackend folder)
PROJECT_ROOT = r'/Volumes/Keiko/FaceTrack/FaceTrack1/FaceTrack/Backend/FaceRecognitionBackend'


sys.path.append(PROJECT_ROOT)

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognitionBackend.settings')

# Initialize Django
try:
    django.setup()
except Exception as e:
    print(f"Failed to initialize Django: {e}")
    sys.exit(1)


from Camera.models import Camera

def capture_frames_with_ffmpeg(camera_url, output_dir, fps=1):
    """Capture frames from camera using FFmpeg."""
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_pattern = os.path.join(output_dir, f"frame_{timestamp}_%04d.jpg")

    ffmpeg_command = [
        "ffmpeg",
        "-timeout", "10000000",
        "-i", camera_url,
        "-rtsp_transport", "tcp",
        "-vf", f"fps={fps}",
        "-q:v", "2",
        output_pattern,
        "-loglevel", "error"
    ]

    try:
        print(f"Starting FFmpeg for {camera_url} at {fps} FPS...")
        subprocess.run(ffmpeg_command, check=True)
        print(f"Successfully captured frames from {camera_url}")
    except subprocess.CalledProcessError as e:
        print(f"Error capturing from {camera_url}: {e}")

def get_operational_cameras():
    """Fetch all operational cameras from database."""
    return Camera.objects.filter(operational=True)

def process_cameras(output_base_dir="/Volumes/Keiko/FaceTrack/FaceTrack1/FaceTrack/Backend/model/captured_frames"):
    """Process all operational cameras."""
    cameras = get_operational_cameras()
    if not cameras:
        print("No operational cameras found in database")
        return

    with ThreadPoolExecutor(max_workers=len(cameras)) as executor:
        for camera in cameras:
            camera_dir = os.path.join(output_base_dir, f"camera_{camera.id}")
            executor.submit(
                capture_frames_with_ffmpeg,
                camera.url,
                camera_dir,
                camera.fps or 1  
            )

if __name__ == "__main__":
    print("Starting camera frame capture process...")
    process_cameras()