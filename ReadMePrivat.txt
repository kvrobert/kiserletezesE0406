electron-builder.yml haszn�lata:
appId: com.example.app
copyright: Example co
productName: MyApp

asar: false

directories:
  buildResources: dist-assets/
  output: dist/

files:
  - package.json
  - build/
  - ./*            // --> minden file-t a gy�k�rbe tesz mindennel egy�tt
  - node_modules/

dmg:
  contents:
    - type: link
      path: /Applications
      x: 410
      y: 150
    - type: file
      x: 130
      y: 150

mac:
  target: dmg
  category: public.app-category.tools

win:
  target: portable              // portable de lehet m�s is....

linux:
  target:
    - deb
    - AppImage