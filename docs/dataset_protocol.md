# Controlled evaluation dataset protocol

## Target

- 10 physical packaged products
- 6 photographs per product
- 60 real evaluation images total

## Product coverage

Across the ten products, cover as far as practical:

- at least one product with 0 warnings
- at least one product with 1 warning
- at least one product with 2 warnings
- at least one product with 3 warnings
- ideally one product with all 4 warnings
- approximately five planar packages
- approximately five curved packages
- matte and glossy finishes

## Six acquisition conditions

| Code | Condition | Acquisition guidance |
|---|---|---|
| c1 | Reference | frontal, adequate light, no intentional glare/occlusion |
| c2 | Oblique | approximately 30–45° viewing angle |
| c3 | Specular glare | visible reflection affecting the package surface |
| c4 | Low illumination | dim environment, no flash |
| c5 | Partial occlusion | part of at least one warning obscured |
| c6 | Increased distance | product/warning occupies fewer image pixels |

## Naming convention

```text
P03_c1_reference.jpg
P03_c2_oblique.jpg
P03_c3_glare.jpg
P03_c4_lowlight.jpg
P03_c5_occlusion.jpg
P03_c6_distance.jpg
```

## Ground truth

For each physical product record product ID, category, geometry, finish, number of warnings, and exact warning set.

Synthetic or web-sourced images may support development but do not substitute for these 60 controlled real photographs.
