import os, sys
import pickle
from deepface import DeepFace

# absolute path needed

REGISTERED_FACES_DIR = os.path.dirname(sys.path[0])+'/FaceRecognitionBackend/user_images'
EMBEDDINGS_FILE = sys.path[0]+'/embeddings.pkl'
# Load existing embeddings if the file exists
if os.path.exists(EMBEDDINGS_FILE):
    with open(EMBEDDINGS_FILE, "rb") as f:
        known_embeddings = pickle.load(f)
    print("Stored embeddings:")
    for name, embedding in known_embeddings.items():
        print(f"{name}: {embedding}")
else:
    known_embeddings = {}


print("Computing embeddings for new faces...")

for filename in os.listdir(REGISTERED_FACES_DIR):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        name = os.path.splitext(filename)[0] 
        image_path = os.path.join(REGISTERED_FACES_DIR, filename)

        if name not in known_embeddings:
            try:
                embedding = DeepFace.represent(img_path=image_path, model_name="Facenet")[0]["embedding"]
                known_embeddings[name] = embedding
                print(f"Embedding computed for {name}")
            except Exception as e:
                print(f"Error processing {name}'s image: {e}")
        else:
            print(f"Skipping {name}, embedding already exists.")


with open(EMBEDDINGS_FILE, "wb") as f:
    pickle.dump(known_embeddings, f)

print(f"Embeddings updated and saved to {EMBEDDINGS_FILE}")