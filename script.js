let WIDTH = 800;
let HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let balls = [];
let ballSize = 80;
let lives = 10;
let livesText;
let gameOverText;
let restartButton;

function preload() {
    this.load.image("ball", "assets/ball.png");
}

function create() {
    // Add multiple balls
    for (let i = 0; i < 3; i++) {
        let x = Phaser.Math.Between(ballSize, WIDTH - ballSize);
        let y = Phaser.Math.Between(ballSize, HEIGHT - ballSize);
        let ball = this.physics.add.sprite(x, y, "ball");
        ball.setDisplaySize(ballSize, ballSize);
        ball.setCollideWorldBounds(true);
        ball.setBounce(1, 1);
        ball.setVelocity(
            Phaser.Math.Between(-200, 200),
            Phaser.Math.Between(-200, 200)
        );
        ball.setInteractive();

        // On click, shrink, speed up, and add a life
        ball.on('pointerdown', () => {
            ball.displayWidth *= 0.9;
            ball.displayHeight *= 0.9;
            ball.body.velocity.x *= 1.1;
            ball.body.velocity.y *= 1.1;
            lives += 1;
            updateLivesText();
        });

        balls.push(ball);
    }

    // Enable ball-to-ball collisions
    this.physics.add.collider(balls, balls);

    // Display lives
    livesText = this.add.text(16, 16, 'Lives: ' + lives, {
        fontSize: '32px',
        fill: '#fff'
    });

    // Game Over text (hidden initially)
    gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, 'Game Over', {
        fontSize: '64px',
        fill: '#f00'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    // Restart button (hidden initially)
    restartButton = this.add.text(WIDTH / 2, HEIGHT / 2 + 80, 'Restart', {
        fontSize: '48px',
        fill: '#0f0',
        backgroundColor: '#222',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setVisible(false);

    restartButton.on('pointerdown', () => {
        lives = 10;                // Reset lives
        balls = [];                // Clear balls array
        gameOverText.setVisible(false); // Hide Game Over text
        restartButton.setVisible(false); // Hide Restart button
        this.scene.restart();      // Restart the scene
    });

    // Listen for world bounds collision
    this.physics.world.on('worldbounds', (body) => {
        if (lives > 0) {
            lives -= 1;
            updateLivesText();
            if (lives <= 0) {
                endGame(this);
            }
        }
    });

    // Enable world bounds and collision event for each ball
    balls.forEach(ball => {
        ball.body.onWorldBounds = true;
    });
}

function update() {
    if (lives <= 0) return;
    // No manual movement needed; physics handles it
}

function updateLivesText() {
    livesText.setText('Lives: ' + lives);
}

function endGame(scene) {
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
    balls.forEach(ball => {
        ball.body.setVelocity(0, 0);
        ball.disableInteractive();
    });
}
