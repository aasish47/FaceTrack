# import os
# import subprocess
# from datetime import datetime

# def capture_frames_with_ffmpeg(camera_url, output_dir, fps=1):
#     """
#     Captures frames from a camera feed using FFmpeg.

#     Args:
#         camera_url (str): The camera URL (HTTP or RTSP).
#         output_dir (str): Directory to save captured frames.
#         fps (int): Frames per second to capture.
#     """
#     # Create the output directory if it doesn't exist
#     os.makedirs(output_dir, exist_ok=True)

#     # Define the output file naming pattern
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     output_pattern = os.path.join(output_dir, f"frame_{timestamp}_%04d.jpg")

#     # FFmpeg command to capture frames
#     ffmpeg_command = [
#         "ffmpeg", "-i", camera_url,    # Input camera feed
#         "-vf", f"fps={fps}",          # Frame rate filter
#         "-q:v", "2",                  # Image quality
#         output_pattern                # Output file pattern
#     ]

#     try:
#         print(f"Starting FFmpeg to capture frames at {fps} FPS...")
#         subprocess.run(ffmpeg_command, check=True)
#         print("Frames captured successfully.")
#     except subprocess.CalledProcessError as e:
#         print(f"Error capturing frames: {e}")

# if __name__ == "__main__":

#     print("video processing starts")
#     # Replace with your correct HTTP or RTSP camera URL
#     camera_url = "http://192.168.29.154:8080/video"
    
#     # Directory to save the captured frames
#     output_directory = "FaceTrack/Backend/model/captured_frames"

#     # Set the desired frames per second (e.g., 1 frame per second)
#     capture_fps = 3

#     # Start capturing frames
#     capture_frames_with_ffmpeg(camera_url, output_directory, capture_fps)







import os
import subprocess
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

def capture_frames_with_ffmpeg(camera_url, output_dir, fps=1):
    """
    Captures frames from a camera feed using FFmpeg.

    Args:
        camera_url (str): The camera URL (HTTP or RTSP).
        output_dir (str): Directory to save captured frames.
        fps (int): Frames per second to capture.
    """
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Define the output file naming pattern
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_pattern = os.path.join(output_dir, f"frame_{timestamp}_%04d.jpg")

    # FFmpeg command to capture frames
    ffmpeg_command = [
        "ffmpeg", "-i", camera_url,    # Input camera feed
        "-vf", f"fps={fps}",          # Frame rate filter
        "-q:v", "2",                  # Image quality
        output_pattern                # Output file pattern
    ]

    try:
        print(f"Starting FFmpeg for {camera_url} at {fps} FPS...")
        subprocess.run(ffmpeg_command, check=True)
        print(f"Frames captured successfully from {camera_url}.")
    except subprocess.CalledProcessError as e:
        print(f"Error capturing frames from {camera_url}: {e}")

def process_multiple_cameras(camera_urls, output_base_dir, fps=1):
    """
    Processes multiple camera feeds simultaneously.

    Args:
        camera_urls (list): List of camera URLs.
        output_base_dir (str): Base directory to save captured frames.
        fps (int): Frames per second to capture.
    """
    with ThreadPoolExecutor(max_workers=len(camera_urls)) as executor:
        for i, url in enumerate(camera_urls):
            output_dir = os.path.join(output_base_dir, f"camera_{i+1}")
            executor.submit(capture_frames_with_ffmpeg, url, output_dir, fps)

if __name__ == "__main__":
    print("Starting video processing for multiple cameras...")

    # List of camera URLs
    camera_urls = [
        "http://192.168.29.154:8080/video",
        "http://192.168.29.82:8080/video"
    ]
    
    # Base directory to save the captured frames
    output_base_directory = "FaceTrack/Backend/model/captured_frames"
    
    # Set the desired frames per second (e.g., 1 frame per second)
    capture_fps = 3

    # Start capturing frames from multiple cameras
    process_multiple_cameras(camera_urls, output_base_directory, capture_fps)