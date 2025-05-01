# import os, sys
# import pickle
# from deepface import DeepFace

# # absolute path needed

# REGISTERED_FACES_DIR = os.path.dirname(sys.path[0])+'/FaceRecognitionBackend/user_images'
# EMBEDDINGS_FILE = sys.path[0]+'/embeddings.pkl'
# # Load existing embeddings if the file exists
# if os.path.exists(EMBEDDINGS_FILE):
#     with open(EMBEDDINGS_FILE, "rb") as f:
#         known_embeddings = pickle.load(f)
#     print("Stored embeddings:")
#     for name, embedding in known_embeddings.items():
#         print(f"{name}: {embedding}")
# else:
#     known_embeddings = {}


# print("Computing embeddings for new faces...")

# for filename in os.listdir(REGISTERED_FACES_DIR):
#     if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
#         name = os.path.splitext(filename)[0] 
#         image_path = os.path.join(REGISTERED_FACES_DIR, filename)

#         if name not in known_embeddings:
#             try:
#                 embedding = DeepFace.represent(img_path=image_path, model_name="Facenet")[0]["embedding"]
#                 known_embeddings[name] = embedding
#                 print(f"Embedding computed for {name}")
#             except Exception as e:
#                 print(f"Error processing {name}'s image: {e}")
#         else:
#             print(f"Skipping {name}, embedding already exists.")


# with open(EMBEDDINGS_FILE, "wb") as f:
#     pickle.dump(known_embeddings, f)

# print(f"Embeddings updated and saved to {EMBEDDINGS_FILE}")






import os, sys
import pickle
from insightface.app import FaceAnalysis
import cv2

# Define paths
REGISTERED_FACES_DIR = os.path.dirname(sys.path[0]) + '/FaceRecognitionBackend/user_images'
EMBEDDINGS_FILE = sys.path[0] + '/embeddings.pkl'

# Load existing embeddings if the file exists
if os.path.exists(EMBEDDINGS_FILE):
    with open(EMBEDDINGS_FILE, "rb") as f:
        known_embeddings = pickle.load(f)
    print("Stored embeddings:")
    for name, embedding in known_embeddings.items():
        print(f"{name}: {embedding[:5]}...")  # Print only part for brevity
else:
    known_embeddings = {}

# Initialize InsightFace app
app = FaceAnalysis(name='buffalo_l')  # Uses ArcFace with ResNet100
app.prepare(ctx_id=0)  # 0 = CPU; set -1 to use GPU

print("Computing embeddings for new faces...")

for filename in os.listdir(REGISTERED_FACES_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        name = os.path.splitext(filename)[0]
        image_path = os.path.join(REGISTERED_FACES_DIR, filename)

        if name not in known_embeddings:
            try:
                img = cv2.imread(image_path)
                faces = app.get(img)

                if faces:
                    embedding = faces[0].embedding
                    known_embeddings[name] = embedding
                    print(f"Embedding computed for {name}")
                else:
                    print(f"No face found in {filename}, skipping.")

            except Exception as e:
                print(f"Error processing {name}'s image: {e}")
        else:
            print(f"Skipping {name}, embedding already exists.")

# Save updated embeddings
with open(EMBEDDINGS_FILE, "wb") as f:
    pickle.dump(known_embeddings, f)

print(f"Embeddings updated and saved to {EMBEDDINGS_FILE}")