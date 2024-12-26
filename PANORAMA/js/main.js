document.addEventListener('DOMContentLoaded', function() {
  const panoImage = document.getElementById('pano-image');

  // Массив путей к панорамам
  const panoPaths = [
      '../images/pano1.jpg',
      '../images/pano2.jpg',
      '../images/pano3.jpg',
      '../images/pano4.jpg',
      '../images/pano5.jpg',
      '../images/pano6.jpg',
      '../images/pano7.jpg',
      '../images/pano8.jpg',
      '../images/pano9.jpg',
      '../images/pano10.jpg',
      '../images/pano11.jpg',
      '../images/pano12.jpg',
      '../images/pano13.jpg',
      '../images/pano14.jpg',
      '../images/pano15.jpg',
      '../images/pano16.jpg',
      '../images/pano17.jpg',
  ];

  const panoramas = panoPaths.map(path => new PANOLENS.ImagePanorama(path));

  // Настройка viewer
  const viewer = new PANOLENS.Viewer({
      container: panoImage
  });

  // Объект для хранения координат инфоспотов
  const infospotPositions = {
      0: [ // 1 floor main
          { position: { x: -1500, y: -100, z: 8000 }, direction: { x: -1500, y: -100, z: 8000 }, target: 1 },
          { position: { x: 2500, y: 100, z: -2500 }, direction: { x: 2500, y: 100, z: -2500 }, target: 7 },
          { position: { x: 1500, y: 100, z: -7500 }, direction: { x: 1500, y: 100, z: -7500 }, target: 8 },
          { position: { x: 4000, y: 100, z: -800 }, direction: { x: 4000, y: 100, z: -800 }, target: 14 },
          { position: { x: 2700, y: -100, z: 8000 }, direction: { x: 2700, y: -100, z: 8000 }, target: 14 }
         ],
      1: [ // left part before doors
          { position: { x: 2000, y: -100, z: 4500 }, direction: { x: 2000, y: -100, z: 4500 }, target: 2 },
          { position: { x: 0, y: 100, z: -4500 }, direction: { x: 0, y: 100, z: -4500 }, target: 0 }
         ],
      2: [ // left part after doors
          { position: { x: 500, y: 200, z: 1000 }, direction: { x: 500, y: 200, z: 1000 }, target: 3},
          { position: { x: 8000, y: 200, z: 100 }, direction: { x: 8000, y: 200, z: 100 }, target: 4 },
          { position: { x: -4500, y: -200, z: -100 }, direction: { x: -4500, y: -200, z: -100 }, target: 1 },

        ],
      3: [ // 123 cla$$
          { position: { x: -2000, y: -200, z: -3000 }, direction: { x: -2000, y: -200, z: -3000 }, target: 2 }
      ],
      4: [ // left far hall
          { position: { x: 650, y: 300, z: 1000 }, direction: { x: 650, y: 300, z: 1000 }, target: 5 },
          { position: { x: -5000, y: 500, z: -500 }, direction: { x: -5000, y: 500, z: -500 }, target: 2 },
          { position: { x: 5000, y: 300, z: -1000 }, direction: { x: 5000, y: 300, z: -1000 }, target: 6 }
      ],
      5: [ // 117 cla$$
          { position: { x: -5000, y: 200, z: -5000 }, direction: { x: -5000, y: 200, z: -5000 }, target: 4 }
      ],
      6: [ // teacher's lift
          { position: { x: -4500, y: 300, z: 3300 }, direction: { x: -4500, y: 300, z: 3300 }, target: 4 }
      ],
      7: [ // red MGIMO
          { position: { x: 5000, y: -100, z: -750 }, direction: { x: 5000, y: -100, z: -750 }, target: 0 },
          { position: { x: -3000, y: 100, z: 500 }, direction: { x: -3000, y: 100, z: 500 }, target: 9 }
      ],
      8: [ // cafe
          { position: { x: 6500, y: 200, z: -3700 }, direction: { x: 6500, y: 200, z: -3700 }, target: 0 },
      ],
      9: [ // right part after doors
          { position: { x: 2500, y: 200, z: 3000 }, direction: { x: 2500, y: 200, z: 3000 }, target: 10 },
          { position: { x: -5500, y: 200, z: 500 }, direction: { x: -5500, y: 200, z: 500 }, target: 7},
          { position: { x: 5500, y: 400, z: -300 }, direction: { x: 5500, y: 400, z: -300 }, target: 11}
      ],
      10: [ // 134
          { position: { x: -3500, y: -300, z: 2000 }, direction: { x: -3500, y: -300, z: 2000 }, target: 9 }
      ],
      11: [ // right far hall
          { position: { x: -1500, y: -300, z: -1000 }, direction: { x: -1500, y: -300, z: -1000 }, target: 12 },
          { position: { x: -4000, y: 200, z: 2000 }, direction: { x: -4000, y: 200, z: 2000 }, target: 9 },
          { position: { x: 4000, y: 200, z: -2000 }, direction: { x: 4000, y: 200, z: -2000 }, target: 13 }
      ],
      12: [ // 145A cla$$
          { position: { x: -4500, y: 100, z: 0 }, direction: { x: -4500, y: 100, z: 0 }, target: 11 }
      ],
      13: [ // SOK
          { position: { x: -8000, y: -100, z: -2500 }, direction: { x: -8000, y: -100, z: -2500 }, target: 11 }
      ],
      14: [ // 5 floor left hall
          { position: { x: 3000, y: -100, z: -7000 }, direction: { x: 3000, y: -100, z: -7000 }, target: 0 },
          { position: { x: 3000, y: -100, z: -1500 }, direction: { x: 3000, y: -100, z: -1500 }, target: 15 },
          { position: { x: 250, y: 100, z: 3000 }, direction: { x: 250, y: 100, z: 3000 }, target: 16 }
      ],
      15: [ // 543 cla$$
        { position: { x: -5000, y: -100, z: -100 }, direction: { x: -5000, y: -100, z: -100 }, target: 14 }
    ],
      16: [ // 5 floor left far hall
        { position: { x: -4000, y: 150, z: 100 }, direction: { x: -4000, y: 150, z: 100 }, target: 14 }
    ]
    };

  // Функция переключения с анимацией
  const switchPanorama = (targetPano) => {
      if(targetPano.loaded && targetPano.active){
          return;
      }

      if(viewer.panorama) {
          viewer.panorama.fadeOut(500);
      }

      targetPano.addEventListener('enter-fade-complete', function(){
          viewer.setPanorama(targetPano);
      }, { once: true});

      targetPano.addEventListener('error', () => {
          console.error(`Error loading panorama: ${targetPano.src}`);
      });
      targetPano.load();
  };

  // Добавление панорам
  panoramas.forEach(panorama => viewer.add(panorama));

  // Функция для создания infospots
  const createInfospot = (panorama, targetPanorama, position, direction) => {
      const infospot = new PANOLENS.Infospot(300, PANOLENS.DataImage.Arrow);
      infospot.position.set(position.x, position.y, position.z);
      infospot.addEventListener('click', function() {
          switchPanorama(targetPanorama);
      });
      panorama.add(infospot);
      panorama.link(targetPanorama, new THREE.Vector3(direction.x, direction.y, direction.z));
  };
  // Создание переходов
  for (let i = 0; i < panoramas.length; i++) {
      const currentPano = panoramas[i];
      const transitions = infospotPositions[i] || []; // Получаем массив переходов для текущей панорамы
          transitions.forEach(transition => {
              if (transition.target >= 0 && transition.target < panoramas.length && transition.target !== i) {
                const targetPanorama = panoramas[transition.target];
                   createInfospot(currentPano, targetPanorama, transition.position, transition.direction);
              } else {
                  console.warn(`Invalid target panorama index ${transition.target} in panorama ${i}`);
              }

          })

  }
});