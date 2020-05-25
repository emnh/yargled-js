import * as PIXI from 'pixi.js';
const $ = require('jquery');

function getVars(state) {
  const tileWidth = 64;
  const tileHeight = 64;

  state.tilesX = 20;
  state.tilesY = 20;

  const size = Math.min(state.width, state.height) - 4 * tileWidth;
  state.mapWidth = size;
  state.mapHeight = size;

  const scaleX = size / (tileWidth * state.tilesX);
  const scaleY = scaleX;

  state.tileWidth = tileWidth;
  state.tileHeight = tileHeight;
  state.scaleX = scaleX;
  state.scaleY = scaleY;
}

function getClasses(state) {
  const placeholder = new PIXI.Graphics();
  placeholder.lineStyle(2, 0x000000, 1);
  placeholder.beginFill(0xFFFFFF);
  placeholder.drawRect(0, 0, state.tileWidth * state.scaleX * 0.5, state.tileHeight * state.scaleY * 0.1);
  placeholder.endFill();

  const Creep = function() {
    this.sprite = placeholder;
    this.health = 0;
    this.damage = 0;
    this.range = 0;
    this.delay = 0;
  };

  const Tower = function() {
    this.sprite = placeholder;
    this.health = 0;
    this.damage = 0;
    this.range = 0;
    this.delay = 0;
  };

  state.classes = {
    Creep: Creep,
    Tower: Tower
  };
}

function addTerrain(state, x, y, texture) {
  const sprite = new PIXI.Sprite(texture);
  sprite.scale.x = state.scaleX;
  sprite.scale.y = state.scaleY;
  sprite.x = x * state.tileWidth * state.scaleX;
  sprite.y = y * state.tileHeight * state.scaleY;
  state.container.addChild(sprite);
  return sprite;
}

function fire(state) {
  for (let i = 0; i < state.towers.length; i++) {
    const t = state.towers[i];
    const r = addTerrain(state, 0, 0, state.rocketTexture);
    r.x = t.x;
    r.y = t.y;
    r.rotation = t.rotation;
    r.lifetime = performance.now() + Math.random() * 1000.0;
    r.visible = false;
    r.pivot.x = state.tileWidth * 0.5;
    r.pivot.y = r.pivot.x;
    //r.x += r.pivot.x * state.scaleX;
    //r.y += r.pivot.y * state.scaleY;
    t.rockets.push(r);
  }
}

function drawTerrain(state) {
  // Create a new texture
  const grassTexture = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile024.png');
  const dirtTexture = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile093.png');
  const dirtTextureNorth = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile116.png');
  const dirtTextureSouth = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile070.png');
  const towerBase = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile180.png');
  const tower = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile206.png');
  const manTexture = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile245.png');
  const bushes = [
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile130.png'),
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile131.png'),
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile132.png'),
    //PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile133.png'),
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile134.png')
  ];
  const rocks = [
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile135.png'),
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile136.png'),
    PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile137.png')
  ];


  for (let x = 0; x < state.tilesX; x++) {
    for (let y = 0; y < state.tilesY; y++) {
      addTerrain(state, x, y, grassTexture);
    }
  }

  for (let x = 0; x < state.tilesX; x++) {
      addTerrain(state, x, state.tilesY / 2 - 1, dirtTextureSouth);
      addTerrain(state, x, state.tilesY / 2, dirtTexture);
      addTerrain(state, x, state.tilesY / 2 + 1, dirtTextureNorth);
  }

  for (let i = 0; i < 2; i++) {
    for (let x = 0; x < state.tilesX; x++) {
      for (let y = 0; y < state.tilesY; y++) {
        const x2 = Math.floor(Math.random() * state.tilesX);
        const y2 = Math.floor(Math.random() * state.tilesY);
        if (x2 == 0 || y2 == 0 || (x2 == state.tilesX - 1) || (y2 == state.tilesY - 1) || Math.abs(y2 - state.tilesY / 2) <= 1) {
          continue;
        }
        if (x2 % 2 == 1 || y2 % 2 == 1) {
          //continue;
        }
        const target = i >= 1 ? bushes : rocks;
        const ri = Math.floor(Math.random() * target.length);
        if (ri < target.length) {
          //const bush = addTerrain(state, x, y, bushes[ri]);
          const bush = addTerrain(state, x2, y2, target[ri]);
          //bush.x += Math.floor((Math.random() - 0.5) * state.tileWidth * state.scaleX * 0.25);
          //bush.y += Math.floor((Math.random() - 0.5) * state.tileHeight * state.scaleY * 0.25);
          bush.scale.x *= 1.5 * Math.random() + 0.5;
          bush.scale.y = bush.scale.x;
          bush.pivot.x = state.tileWidth * bush.scale.x * 0.5;
          bush.pivot.y = state.tileHeight * bush.scale.y * 0.5;
          bush.x += bush.pivot.x * 0.75;
          bush.y += bush.pivot.y * 0.75;
          bush.rotation = Math.random() * 2.0 * Math.PI;
          if (target == bushes) {
            //bush.tint = '0x00F000';
          }
        }
      }
    }
  }

  state.towers = [];
  state.creeps = [];
  for (let x = 0; x < state.tilesX; x++) {
      addTerrain(state, x, state.tilesY / 2 - 1, towerBase);
      addTerrain(state, x, state.tilesY / 2 + 1, towerBase);
      const t1 = addTerrain(state, x, state.tilesY / 2 - 1, tower);
      t1.pivot.x = state.tileWidth * 0.5;
      t1.pivot.y = t1.pivot.x;
      t1.x += t1.pivot.x * state.scaleX;
      t1.y += t1.pivot.y * state.scaleY;
      t1.rotation = Math.random() * Math.PI * 2.0;
      t1.rockets = [];
      const t2 = addTerrain(state, x, state.tilesY / 2 + 1, tower);
      t2.pivot.x = t1.pivot.x;
      t2.pivot.y = t1.pivot.x;
      t2.x += t2.pivot.x * state.scaleX;
      t2.y += t2.pivot.y * state.scaleY;
      t2.rotation = Math.random() * Math.PI * 2.0;
      state.towers.push(t1);
      state.towers.push(t2);
      t2.rockets = [];
  }
  for (let x = 0; x < state.tilesX; x++) {
      const manContainer = new PIXI.Container();
      const man = addTerrain(state, -x, state.tilesY / 2, manTexture);
      man.parent.removeChild(man);
      man.pivot.x = state.tileWidth * 0.5;
      man.pivot.y = man.pivot.x;
      manContainer.x = man.x;
      manContainer.y = man.y;
      manContainer.creep = man;
      manContainer.addChild(man);
      man.x = man.pivot.x * state.scaleX;
      man.y = man.pivot.y * state.scaleY;
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(2, 0x000000, 1);
      graphics.beginFill(0x00FF00);
      graphics.drawRect(0, 0, state.tileWidth * state.scaleX * 0.5, state.tileHeight * state.scaleY * 0.1);
      graphics.endFill();
      manContainer.addChild(graphics);
      graphics.x = graphics.width * 0.5;
      graphics.y = -state.scaleY;
      state.creeps.push(manContainer);
      state.container.addChild(manContainer);
  }
}

function main() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const state = {
    width: width,
    height: height,
  };

  getVars(state);

  getClasses(state);

  const app = new PIXI.Application({
      width: width, height: height, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
  });
  document.body.appendChild(app.view);
  $("body")
    .css("overflow", "hidden")
    .css("margin", "0px");

  const container = new PIXI.Container();
  state.container = container;

  app.stage.addChild(container);

  drawTerrain(state);

  // Move container to the center
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  // Center bunny sprite in local container coordinates
  container.pivot.x = state.mapWidth / 2;
  container.pivot.y = state.mapHeight / 2;

  // Listen for animate update
  state.rocketTexture = PIXI.Texture.from('resources/images/kenney-td/towerDefense_tile252.png');
  state.explosionTexture = PIXI.Texture.from('resources/images/explosion/explosion.png');

  setInterval(function() { fire(state); }, 100);

  app.ticker.add((delta) => {
      // rotate the container!
      // use delta to create frame-independent transform
      // container.rotation -= 0.01 * delta;
      const time = performance.now();
      for (let i = 0; i < state.towers.length; i++) {
        const t = state.towers[i];
        t.rotation += (Math.random() - 0.5) * 0.5;
        const newRockets = [];
        for (let j = 0; j < t.rockets.length; j++) {
          const r = t.rockets[j];
          const speed = 5.0;
          const rotation = -Math.PI / 2.0 + r.rotation;
          const flytime = 400.0;
          const exptime = 200.0;
          if (time - r.lifetime <= 0.0) {
            r.visible = false;
            newRockets.push(r);
          } else if (time - r.lifetime <= flytime) {
            r.x += speed * Math.cos(rotation);
            r.y += speed * Math.sin(rotation);
            r.visible = true;
            newRockets.push(r);
          } else if (time - r.lifetime < flytime + exptime) {
            r.texture = state.explosionTexture;
            const time2 = (time - r.lifetime - flytime) / exptime;
            r.pivot.x = 128 * 0.5;
            r.pivot.y = 129 * 0.5;
            r.scale.x = 0.25 * Math.sin(1.0 * Math.PI * time2) + 0.0;
            r.scale.y = r.scale.x;
            r.visible = true;
            newRockets.push(r);
          } else {
            r.parent.removeChild(r);
          }
        }
        t.rockets = newRockets;
      }
      for (let i = 0; i < state.creeps.length; i++) {
        const st = (Math.sin(20.0 * time / 1000.0 + i) + 2.0) * 0.25;
        const tc = state.creeps[i];
        const t = tc.creep;
        tc.visible = tc.x >= 0.0;
        t.rotation += (Math.random() - 0.5) * 0.1;
        if (t.rotation <= -Math.PI / 8.0) {
          t.rotation = -Math.PI / 8.0;
        }
        if (t.rotation >= Math.PI / 8.0) {
          t.rotation = Math.PI / 8.0;
        }
        const ny = tc.y + st * Math.sin(t.rotation);
        if (Math.abs(ny / (state.tileHeight * state.scaleY) - state.tilesY / 2 - 0.0) <= 0.45) {
          tc.y = ny;
        }
        tc.x += st * Math.cos(t.rotation);
        if (tc.x >= state.mapWidth) {
          tc.x = 0.0;
        }
      }
  });
}

$(main);
