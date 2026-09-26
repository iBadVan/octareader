# OctaReader

**OctaReader** is a research prototype for recognizing Peru's four front-of-package warning octagons and converting them into a machine-readable warning profile that can be explained and compared across products.

> Research status: active prototype. The controlled evaluation set is intentionally kept separate from development/training data.

## Core idea

```text
Product image
    ↓
YOLO11n detector
    ↓
Detected warning classes
    ↓
Binary warning profile
    ↓
Interpretation
    ↓
Product A vs Product B comparison
```

The four target classes are:

1. `alto_azucar`
2. `alto_sodio`
3. `alto_grasas_saturadas`
4. `contiene_grasas_trans`

A warning profile is represented as:

```json
{
  "alto_azucar": 1,
  "alto_sodio": 0,
  "alto_grasas_saturadas": 1,
  "contiene_grasas_trans": 0
}
```

## Scope limitation

OctaReader compares **warning sets**, not nutrient quantities. If two products both carry `ALTO EN AZÚCAR`, the system does **not** infer which product contains more sugar because the warning itself does not encode that magnitude.

## Quick start

Python 3.10+ is recommended.

```bash
python -m venv .venv
pip install -r requirements.txt
pip install -e .
pytest
```

## Controlled evaluation protocol

The planned evaluation uses **10 physical products × 6 acquisition conditions = 60 real photographs**:

1. reference / frontal / adequate light
2. oblique angle
3. specular glare
4. low illumination
5. partial occlusion
6. increased distance

Evaluation images are kept separate from development/training data.

See [docs/dataset_protocol.md](docs/dataset_protocol.md) and [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Repository structure

```text
configs/               YOLO dataset configuration
data/development/      training/tuning material
data/evaluation/       controlled 60-image evaluation set
docs/                  architecture and methodology
results/               measured experiment outputs
scripts/               augmentation and validation utilities
src/octareader/        core Python modules
tests/                 unit tests
```

## Research use

This repository supports the OctaReader research project. It is a work in progress and does not provide medical or nutritional advice.


## Web demo

A Vercel-ready interactive demo is included under `web/`.

The demo lets users:
- upload two product photos,
- select/demo detected warning classes,
- inspect the machine-readable warning profile,
- compare Product A vs Product B,
- visualize the planned 10 × 6 evaluation design.

The interface is intentionally labeled as **Demo UI** because the trained YOLO11n detector has not yet been connected to the frontend.

### Deploy on Vercel

Import this GitHub repository into Vercel and deploy from the repository root. The included `vercel.json` routes `/` and `/demo` to the demo interface.

