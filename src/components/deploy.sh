PUBLIC_URL=https://olastor.github.io/fitts-law-experiment/ yarn build && rm -rf docs/ && mv build/ docs/ && git add docs/ && git commit -m "DEPLOY" && git push