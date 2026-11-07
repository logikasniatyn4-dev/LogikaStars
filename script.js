let coins = 0;
let cups = 0;
let gems = 5;
let hp = 100;
let enemyHp = 100;
let position = 20;
let busy = false;
let ninja = false;
let selectedCharacter = "🤠";
let selectedName = "Ковбой";
function update() {
    document.getElementById("coins").textContent = coins;
    document.getElementById("cups").textContent = cups;
    document.getElementById("gems").textContent = gems;
    document.getElementById("hp").textContent = hp;
    document.getElementById("enemyHp").textContent = enemyHp;
    document.getElementById("myHealthBar").style.width = hp + "%";
    document.getElementById("enemyHealthBar").style.width = enemyHp + "%";
    document.getElementById("attackBtn").disabled =
        busy || hp <= 0 || enemyHp <= 0;
    document.getElementById("healBtn").disabled =
        busy || hp <= 0 || hp >= 100;
}
function hideAll() {
    ["menu", "game", "store", "heroes"].forEach(id => {
        document.getElementById(id).classList.add("hidden");
    });
}
function notify(message) {
    const box = document.getElementById("notification");
    box.textContent = message;
    box.style.display = "block";
    clearTimeout(window.notifyTimer);
    window.notifyTimer = setTimeout(() => {
        box.style.display = "none";
    }, 1800);
}
function startGame() {
    hideAll();
    document.getElementById("game").classList.remove("hidden");
    hp = 100;
    enemyHp = 100;
    position = 20;
    busy = false;
    document.getElementById("player").textContent = selectedCharacter;
    document.getElementById("player").style.left = "20%";
    document.getElementById("player").style.filter = "none";
    document.getElementById("enemy").style.display = "block";
    document.getElementById("message").textContent =
        "Переможи суперника!";
    update();
}
function attack() {
    if (busy || hp <= 0 || enemyHp <= 0) return;
    busy = true;
    update();
    const arena = document.getElementById("arena");
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    const startX = player.offsetLeft;
    const startY = player.offsetTop;
    bullet.style.left = startX + "px";
    bullet.style.top = startY + "px";
    arena.appendChild(bullet);
    const endX = enemy.offsetLeft;
    const endY = enemy.offsetTop;
    bullet.animate([
        {
            left: startX + "px",
            top: startY + "px"
        },
        {
            left: endX + "px",
            top: endY + "px"
        }
    ], {
        duration: 400,
        easing: "linear",
        fill: "forwards"
    });
    player.classList.add("player-shake");
    setTimeout(() => {
        player.classList.remove("player-shake");
    }, 300);
    document.getElementById("message").textContent = "🔫 ПОСТРІЛ!";
    setTimeout(() => {
        bullet.remove();
        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.textContent = "💥";
        explosion.style.left = endX + "px";
        explosion.style.top = endY + "px";
        arena.appendChild(explosion);
        setTimeout(() => explosion.remove(), 500);
        enemyHp = Math.max(0, enemyHp - 25);
        enemy.animate([
            { transform: "translate(-50%, -50%) scale(1)" },
            { transform: "translate(-50%, -50%) scale(1.4)" },
            { transform: "translate(-50%, -50%) scale(1)" }
        ], {
            duration: 250
        });
        update();
        if (enemyHp <= 0) {
            busy = false;
            win();
            return;
        }
        document.getElementById("message").textContent =
            "Влучне попадання!";
        setTimeout(() => {
            if (enemyHp > 0) {
                hp = Math.max(0, hp - 20);
            }
            if (hp <= 0) {
                document.getElementById("message").textContent =
                    "ТИ ПРОГРАВ!";
            }
            busy = false;
            update();

        }, 400);

    }, 400);
}
function win() {
    coins += 30;
    cups += 8;
    document.getElementById("message").textContent =
        "ПЕРЕМОГА! +30 монет і +8 кубків!";
    document.getElementById("enemy").style.display = "none";
    update();
    notify("ТИ ПЕРЕМІГ!");
}
function heal() {
    if (hp <= 0 || busy || hp >= 100) return;
    hp = Math.min(100, hp + 20);
    const arena = document.getElementById("arena");
    const player = document.getElementById("player");
    const effect = document.createElement("div");
    effect.className = "heal-effect";
    effect.textContent = "💚 +20 ❤️";
    effect.style.left = position + "%";
    arena.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
    player.style.filter = "drop-shadow(0 0 20px #00ff55)";
    setTimeout(() => {
        player.style.filter = "none";
    }, 1000);
    document.getElementById("message").textContent =
        "💚 ТИ ВИЛІКУВАВСЯ!";
    update();
}
function move(dir) {
    if (hp <= 0 || busy) return;
    position = Math.max(10, Math.min(45, position + dir * 5));
    document.getElementById("player").style.left =
        position + "%";
}
function shop() {
    hideAll();
    document.getElementById("store").classList.remove("hidden");
}
function buyHealth() {
    if (coins < 50) {
        notify("❌ Недостатньо монет!");
        return;
    }
    coins -= 50;
    hp = 100;
    update();
    notify("❤️ Здоров'я відновлено!");
}
function buyGems() {
    if (coins < 100) {
        notify("❌ Недостатньо монет!");
        return;
    }
    coins -= 100;
    gems += 2;
    update();
    notify("💎 +2 КРИСТАЛИ!");
}
function showHeroes() {
    hideAll();
    document.getElementById("heroes").classList.remove("hidden");
}
function buyNinja() {
    if (ninja) {
        notify("🐱‍👤 Ніндзя вже твій!");
        return;
    }
    if (gems < 10) {
        notify("❌ Потрібно 10 кристалів!");
        return;
    }
    gems -= 10;
    ninja = true;
    update();
    notify("🐱‍👤 НІНДЗЯ РОЗБЛОКОВАНИЙ!");
}
function selectHero(character, name) {
    if (name === "Ніндзя" && !ninja) {
        notify("Спочатку розблокуй Ніндзю!");
        return;
    }
    selectedCharacter = character;
    selectedName = name;
    notify("⭐ Вибрано: " + name);
}
function back() {
    busy = false;
    hideAll();
    document.getElementById("menu").classList.remove("hidden");
    update();
}
update();
