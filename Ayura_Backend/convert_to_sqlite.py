import sqlite3
import pandas as pd
import os

BASE = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE, "ayura.db")

if os.path.exists(db_path):
    os.remove(db_path)

print("Connecting to SQLite database...")
conn = sqlite3.connect(db_path)

# 1. Jan Aushadhi
try:
    print("Converting Jan Aushadhi dataset...")
    ja_path = os.path.join(BASE, "Product List_2_5_2026 @ 0_32_40.csv")
    ja_cols = ["Generic Name", "MRP", "Unit Size", "Group Name"]
    df_ja = pd.read_csv(ja_path, usecols=ja_cols)
    df_ja.columns = df_ja.columns.str.strip()
    df_ja.to_sql("jan_aushadhi", conn, if_exists="replace", index=False)
    print("Jan Aushadhi table created.")
except Exception as e:
    print(f"Jan Aushadhi conversion failed: {e}")

# 2. India Medicines (Brand DB)
try:
    print("Converting Brand Medicines dataset...")
    brand_path = os.path.join(BASE, "India Medicines and Drug Info Dataset.csv")
    brand_cols = ["Medicine Name", "Price", "Type of Medicine", "Composition"]
    
    # Process in chunks to keep memory usage minimal during conversion
    chunk_size = 50000
    first_chunk = True
    for chunk in pd.read_csv(brand_path, usecols=brand_cols, chunksize=chunk_size, low_memory=False):
        chunk.columns = chunk.columns.str.strip()
        # Drop rows where Medicine Name is null to keep index clean
        chunk = chunk.dropna(subset=["Medicine Name"])
        if first_chunk:
            chunk.to_sql("brand_meds", conn, if_exists="replace", index=False)
            first_chunk = False
        else:
            chunk.to_sql("brand_meds", conn, if_exists="append", index=False)
    print("Brand meds table created.")
except Exception as e:
    print(f"Brand meds conversion failed: {e}")

# 3. Substitutes
try:
    print("Converting Substitutes dataset...")
    sub_path = os.path.join(BASE, "med_daraset.csv")
    sub_cols = ["name", "Therapeutic Class"]
    sub_cols += [f"substitute{i}" for i in range(5)]
    sub_cols += [f"sideEffect{i}" for i in range(10)]
    sub_cols += [f"use{i}" for i in range(5)]
    
    first_chunk = True
    for chunk in pd.read_csv(sub_path, usecols=sub_cols, chunksize=chunk_size, low_memory=False):
        chunk.columns = chunk.columns.str.strip()
        chunk = chunk.dropna(subset=["name"])
        if first_chunk:
            chunk.to_sql("substitutes", conn, if_exists="replace", index=False)
            first_chunk = False
        else:
            chunk.to_sql("substitutes", conn, if_exists="append", index=False)
    print("Substitutes table created.")
except Exception as e:
    print(f"Substitutes conversion failed: {e}")

# Create Indexes
print("Creating high-speed lookup indexes...")
cur = conn.cursor()
try:
    cur.execute('CREATE INDEX idx_ja_generic_name ON jan_aushadhi("Generic Name");')
    cur.execute('CREATE INDEX idx_brand_medicine_name ON brand_meds("Medicine Name");')
    cur.execute('CREATE INDEX idx_brand_composition ON brand_meds("Composition");')
    cur.execute('CREATE INDEX idx_substitutes_name ON substitutes("name");')
    conn.commit()
    print("Search indexes created successfully.")
except Exception as e:
    print(f"Index creation failed: {e}")

conn.close()
print("All datasets successfully migrated to ayura.db!")
