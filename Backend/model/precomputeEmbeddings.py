# import os
# import pickle
# from deepface import DeepFace
#
# # Paths
# known_faces = {
#     "Aasish": "/Users/aasishsmac/Downloads/PythonProject_1/PythonProject_1/DemoProject/registered_faces/Aasish.jpg",
#     "Obama": "/Users/aasishsmac/Downloads/PythonProject_1/PythonProject_1/DemoProject/registered_faces/Obama.jpg"
# }
#
# # Output file
# EMBEDDINGS_FILE = "/Users/aasishsmac/Downloads/PythonProject_1/PythonProject_1/DemoProject/embeddings.pkl"
#
# # Compute embeddings
# print("Computing embeddings for known faces...")
# known_embeddings = {}
#
# for name, image_path in known_faces.items():
#     try:
#         embedding = DeepFace.represent(img_path=image_path, model_name="Facenet")[0]["embedding"]
#         known_embeddings[name] = embedding
#         print(f"Embedding computed for {name}")
#     except Exception as e:
#         print(f"Error processing {name}'s image: {e}")
#
# # Save embeddings
# with open(EMBEDDINGS_FILE, "wb") as f:
#     pickle.dump(known_embeddings, f)
#
# print(f"Embeddings saved to {EMBEDDINGS_FILE}")


import os
import pickle
from deepface import DeepFace

# Paths
# REGISTERED_FACES_DIR = "test4/FaceTrack/Backend/FaceRecognitionBackend/user_images"
# EMBEDDINGS_FILE = "test4/FaceTrack/Backend/model/embeddings.pkl"

REGISTERED_FACES_DIR = "/Volumes/Keiko/FaceTrack/test4/FaceTrack/Backend/FaceRecognitionBackend/user_images"
EMBEDDINGS_FILE = "/Volumes/Keiko/FaceTrack/test4/FaceTrack/Backend/model/embeddings.pkl"

# Load existing embeddings if the file exists
if os.path.exists(EMBEDDINGS_FILE):
    with open(EMBEDDINGS_FILE, "rb") as f:
        known_embeddings = pickle.load(f)
    print("Stored embeddings:")
    for name, embedding in known_embeddings.items():
        print(f"{name}: {embedding}")
else:
    known_embeddings = {}

# Compute embeddings for new faces
print("Computing embeddings for new faces...")

for filename in os.listdir(REGISTERED_FACES_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        name = os.path.splitext(filename)[0]  # Extract name from filename
        image_path = os.path.join(REGISTERED_FACES_DIR, filename)

        if name not in known_embeddings:  # Check if already present
            try:
                embedding = DeepFace.represent(img_path=image_path, model_name="Facenet")[0]["embedding"]
                known_embeddings[name] = embedding
                print(f"Embedding computed for {name}")
            except Exception as e:
                print(f"Error processing {name}'s image: {e}")
        else:
            print(f"Skipping {name}, embedding already exists.")

# Save updated embeddings
with open(EMBEDDINGS_FILE, "wb") as f:
    pickle.dump(known_embeddings, f)

print(f"Embeddings updated and saved to {EMBEDDINGS_FILE}")