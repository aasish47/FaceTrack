import os
import sys
import subprocess
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import django
from Camera.models import Camera
# Absolute path needed here so, i have taken the path from system and added the folder name manually
PROJECT_ROOT = os.path.dirname(sys.path[0])+'/FaceRecognitionBackend'

CAPTURED_FRAMES = sys.path[0]+'/captured_frames'




sys.path.append(PROJECT_ROOT)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FaceRecognitionBackend.settings')


try:
    django.setup()
except Exception as e:
    print(f"Failed to initialize Django: {e}")
    sys.exit(1)


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

def process_cameras(output_base_dir=CAPTURED_FRAMES):
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