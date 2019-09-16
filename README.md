# FABRIK implementation in Typescript

## Trying it out
`npm run start`

## What is this?
A Typescript implementation of the FABRIK algorithm described
by [Aristidou and Lasenby](http://www.andreasaristidou.com/publications/papers/FABRIK.pdf). The current version of is, for the most part, a line by line transposition of the original pseudocode.

Display of IK limb written using a light brush of D3.

![](/demo/fabrikArm_sept.gif)

![](/demo/fabrikSnake_sept.gif)

### Status
In development but working for single limbs of arbitrary length.

### When was it written?
August 2019 -> now

## Next steps
- Unit tests
- Library-ize
- Functionalize the largely imperative code of the fabrik implementation
- Genericize for multiple limb-ends
