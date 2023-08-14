// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.nivel = 1;
    this.puntos = 0;
    this.velocidadPelota = 200
    this.vidas = 3;
  }

  preload() {
    // load assets

    this.load.image("pelota", "./public/Images/pelota.png");

    this.load.image("pala", "./public/Images/pala.jpg");
    this.load.image("obstaculo", "./public/Images/obstaculo.png");
    this.load.image("ganar", "./public/Images/ganar.jpg");
    this.load.image("borde", "./public/Images/borde.png");
    this.load.image("perder", "./public/Images/perder.jpg");
  }

  create() {
    // create game objects

    this.pelota = this.physics.add.image(400, 100, "pelota");

    this.pelota.setVelocity(this.velocidadPelota, this.velocidadPelota);
    
    this.pelota.setBounce(1, 1);
    this.pelota.setCollideWorldBounds(true);
    this.pelota.setScale(0.3);

    this.nivelText = this.add.text(350, 60, "Nivel:1");
    this.puntosTexto = this.add.text(350, 90, "Puntos:");
    this.pala = this.physics.add.sprite(390, 500, "pala");
    this.pala.body.setAllowGravity(false);
    this.pala.setImmovable(true);
    this.pala.setScale(0.7);
    this.pala.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(
      this.pelota,
      this.pala,
      this.sumarPuntos,
      null,
      this
    );
    this.obstaculo = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.physics.add.collider(this.pelota, this.obstaculo);
    this.borde = this.physics.add.image(400, 594, "borde");
    this.borde.setImmovable(true);
    this.borde.body.setAllowGravity(false);
    this.vidaTexto = this.add.text(350, 120, "Vidas:3");
    this.physics.add.collider(
      this.pelota,
      this.borde,
      this.vidaMenos,
      null,
      this
    );
  }

  update() {
    if (this.cursors.right.isDown) {
      this.pala.setVelocityX(300);
    } else if (this.cursors.left.isDown) {
      this.pala.setVelocityX(-300);
    } else if (this.cursors.down.isDown) {
      this.pala.setVelocityY(300);
    } else if (this.cursors.up.isDown) {
      this.pala.setVelocityY(-350);
    } else {
      this.pala.setVelocity(0);
    }
  }

  sumarPuntos(pelota, pala) {
    this.puntos++;
    this.puntosTexto.setText("Puntos:" + this.puntos);
    if (this.puntos >= 10) {
      this.pasarNivel();
    }
  }
  pasarNivel() {
    this.puntos = 0;
    this.nivel++;
    this.nivelText.setText("Nivel:" + this.nivel);
    this.agregarObstaculo();
    this.velocidadPelota= this.velocidadPelota * 1.1
    this.pelota.setVelocity(this.velocidadPelota, this.velocidadPelota);
    
    console.log(this.velocidadPelota);
    
    
    const colorAleatorio = Phaser.Math.RND.between(0x000000, 0xffffff);
    this.cameras.main.setBackgroundColor(colorAleatorio);
    if (this.nivel > 20) {
      this.scene.pause("game");
      this.pantallaGanar = this.add.image(400, 300, "ganar");
      this.pantallaGanar.setScale(0.8);
    }
  }
  agregarObstaculo() {
    const randomX = Phaser.Math.RND.between(100, 800);
    const randomY = Phaser.Math.RND.between(100, 300);
    const randomSize = Phaser.Math.RND.between(0.7, 1);
    const obstaculo= this.obstaculo.create(randomX, randomY, "obstaculo");
    obstaculo.setScale(randomSize);
    obstaculo.refreshBody()
  }
  vidaMenos(pelota, borde) {
    this.vidas--;
    this.vidaTexto.setText("Vidas:" + this.vidas);
    if (this.vidas <= 0) {
      this.pantallaDerrota = this.add.image(400, 270, "perder");
      this.scene.pause("game");
    }
  }
}
