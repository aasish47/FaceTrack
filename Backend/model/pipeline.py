import subprocess
import sys
import os
import time
from multiprocessing import Process

def get_project_root():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def run_script(script_path):
    try:
        subprocess.run([sys.executable, script_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_path}: {e}")
    except Exception as e:
        print(f"Unexpected error with {script_path}: {e}")

if __name__ == "__main__":
    PROJECT_ROOT = get_project_root()
    relative_paths = [
        "model/videoprocessing.py",
        "model/facedetection.py",
        "model/facerecognition1.py"
    ]
    scripts = [os.path.normpath(os.path.join(PROJECT_ROOT, path)) for path in relative_paths]

    processes = []

    # videoprocessing.py
    p1 = Process(target=run_script, args=(scripts[0],))
    p1.start()
    processes.append(p1)
    print(f"Started {scripts[0]} immediately")

    # Wait 5ms before starting facedetection.py
    time.sleep(0.005) 
    p2 = Process(target=run_script, args=(scripts[1],))
    p2.start()
    processes.append(p2)
    print(f"Started {scripts[1]} after 5ms delay")

    # Wait another 5ms before starting facerecognition1.py
    time.sleep(0.005) 
    p3 = Process(target=run_script, args=(scripts[2],))
    p3.start()
    processes.append(p3)
    print(f"Started {scripts[2]} after additional 5ms delay")

    # Wait for all processes to complete
    for p in processes:
        p.join()
        print(f"Process {p.pid} completed")

    print("All processes completed")