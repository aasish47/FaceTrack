# import os
# import time
# from datetime import datetime
#
# def delete_old_frames(folder_path, interval_minutes=10):
#     """
#     Deletes image files in the specified folder at a given time interval.
#
#     Args:
#         folder_path (str): Path to the folder containing images.
#         interval_minutes (int): Time interval (in minutes) to delete images.
#     """
#     while True:
#         try:
#             if os.path.exists(folder_path):
#                 for file_name in os.listdir(folder_path):
#                     file_path = os.path.join(folder_path, file_name)
#
#                     # Check if the file is an image (by extension)
#                     if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
#                         os.remove(file_path)
#                         print(f"Deleted: {file_path}")
#             else:
#                 print(f"Folder {folder_path} does not exist.")
#         except Exception as e:
#             print(f"Error deleting files: {e}")
#
#         print(f"Next deletion cycle in {interval_minutes} minutes...")
#         time.sleep(interval_minutes * 60)  # Wait for the specified interval
#
# if __name__ == "__main__":
#     output_directory = "D:\\PythonProject_1\\PythonProject_1\\DemoProject\\captured_frames"
#     deletion_interval = 2  # Set time interval in minutes
#
#     delete_old_frames(output_directory, deletion_interval)


import os
import time
from datetime import datetime


def delete_old_frames(folder_path, interval_minutes=10):
    """
    Deletes image files in the specified folder at a given time interval.

    Args:
        folder_path (str): Path to the folder containing images.
        interval_minutes (int): Time interval (in minutes) to delete images.
    """
    while True:
        try:
            if os.path.exists(folder_path):
                for file_name in os.listdir(folder_path):
                    file_path = os.path.join(folder_path, file_name)

                    # Check if the file is an image (by extension) and delete it
                    if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                        os.remove(file_path)
                        print(f"Deleted: {file_path}")
            else:
                print(f"Folder {folder_path} does not exist.")
        except Exception as e:
            print(f"Error deleting files: {e}")

        print(f"Next deletion cycle in {interval_minutes} minutes...")
        time.sleep(interval_minutes * 60)  # Wait for the specified interval


if __name__ == "__main__":
    output_directory = "captured_frames"
    deletion_interval = 1  # Set time interval in minutes

    delete_old_frames(output_directory, deletion_interval)
