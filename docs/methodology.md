# Methodology notes

## Recognition model

The planned detector is YOLO11n with four target classes and 640 × 640 input. Development uses transfer learning from pretrained weights, with photometric and perspective augmentation.

## Separation of development and evaluation

`data/development/` is for original, licensed, or synthetic/augmented material used to train and tune the system.

`data/evaluation/` is reserved for the controlled 60-image acquisition experiment and must not be used to train, tune thresholds, or select checkpoints.

## Product-level metric

A photograph counts as a **correct warning-set recovery** only when every warning physically present is recovered and no absent warning is predicted.

## Latency

Processing time per image should be measured on the actual deployment hardware, excluding model loading from per-image inference latency.
