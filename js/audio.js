// Ses efektleri ve müzik — şimdilik tamamen Web Audio ile kodla üretiliyor
// (dosya yok). Gerçek ses/müzik dosyaları geldiğinde bu modülün içi
// değiştirilir; oyunun geri kalanı yalnızca RT.sfx("isim") çağırır.
(function () {
  var ctx = null, master = null, musicGain = null, sfxGain = null;
  var musicTimer = null;

  function ensure() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return false; }
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    sfxGain = ctx.createGain(); sfxGain.gain.value = sfxLevel(); sfxGain.connect(master);
    musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
    return true;
  }

  // Ayarlardaki 0-100 seviyeleri kazanca (gain) çevrilir
  function sfxLevel() { return 0.6 * RT.save.settings.sfxVol / 100; }
  function musicLevel() { return 1.0 * RT.save.settings.musicVol / 100; }

  RT.setSfxVolume = function () { if (sfxGain) sfxGain.gain.value = sfxLevel(); };

  // Tarayıcılar sesi ancak ilk dokunuştan sonra açmaya izin veriyor
  RT.unlockAudio = function () {
    if (!ensure()) return;
    if (ctx.state === "suspended") ctx.resume();
    RT.updateMusic();
  };

  function tone(freq, start, dur, opts) {
    opts = opts || {};
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = opts.type || "sine";
    o.frequency.setValueAtTime(freq, start);
    if (opts.slideTo) o.frequency.exponentialRampToValueAtTime(opts.slideTo, start + dur);
    var vol = opts.vol || 0.3;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + (opts.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(opts.dest || sfxGain);
    o.start(start); o.stop(start + dur + 0.05);
  }

  var SFX = {
    // Taşa dokunma: yumuşak kabarcık "blup"
    tap: function (t) { tone(420, t, 0.12, { slideTo: 780, vol: 0.25 }); },
    // Üçleme: yükselen parlak arpej
    match: function (t) {
      [660, 880, 1320].forEach(function (f, i) { tone(f, t + i * 0.06, 0.25, { type: "triangle", vol: 0.2 }); });
    },
    joker: function (t) { tone(300, t, 0.3, { slideTo: 900, type: "triangle", vol: 0.2 }); },
    click: function (t) { tone(600, t, 0.06, { vol: 0.15 }); },
    error: function (t) { tone(200, t, 0.18, { type: "square", vol: 0.08 }); },
    win: function (t) {
      [523, 659, 784, 1046, 1318].forEach(function (f, i) { tone(f, t + i * 0.1, 0.5, { type: "triangle", vol: 0.2 }); });
    },
    lose: function (t) {
      [392, 330, 262].forEach(function (f, i) { tone(f, t + i * 0.18, 0.45, { type: "sine", vol: 0.22 }); });
    }
  };

  RT.sfx = function (name) {
    if (!RT.save.settings.sfxVol || !ensure() || ctx.state !== "running") return;
    if (SFX[name]) SFX[name](ctx.currentTime);
  };

  // ---- Müzik: "cadı kulübesi" ambiyansı ----
  // Blue Ocean'la aynı sakin, sarmalayan yapı (yavaş akorlar, 7 sn'de bir geçiş),
  // ama farklı renk: minör ton, müzik kutusu motifleri, alçak kazan uğultusu,
  // yankı ve ara sıra derinden kazan fokurtusu. Geçici (placeholder) — sonra
  // telifsiz gerçek bir parçayla değiştirilebilir.
  var BAR = 7; // saniye
  var CHORDS = [
    [146.8, 174.6, 220.0, 329.6], // Dm(add9)
    [116.5, 146.8, 174.6, 220.0], // B♭maj7
    [98.0, 146.8, 174.6, 233.1],  // Gm7
    [110.0, 146.8, 164.8, 220.0]  // Asus4
  ];
  // Müzik kutusu motifleri (D minör pentatonik; her akora bir tane, sırayla)
  var MOTIFS = [
    [587.3, 698.5, 880.0, 698.5],
    [587.3, 523.3, 440.0],
    [392.0, 440.0, 523.3, 587.3],
    [659.3, 587.3, 440.0]
  ];
  var chordIdx = 0, reverb = null, drone = null;

  // Basit yankı: üretilmiş (sönümlenen gürültü) dürtü yanıtıyla konvolüsyon
  function makeReverb() {
    var len = Math.floor(ctx.sampleRate * 3.2), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = ir.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    var conv = ctx.createConvolver(); conv.buffer = ir;
    var wet = ctx.createGain(); wet.gain.value = 0.55;
    conv.connect(wet); wet.connect(musicGain);
    return conv;
  }

  // Kazan uğultusu: alçak D, yavaşça "nefes alan" ses seviyesi
  function startDrone() {
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
    var lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    o.frequency.value = 73.4; o2.frequency.value = 73.4 * 1.5; o2.detune.value = 4;
    g.gain.value = 0.035;
    lfo.frequency.value = 0.09; lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain); lfoGain.connect(g.gain);
    o.connect(g); o2.connect(g); g.connect(musicGain); g.connect(reverb);
    o.start(); o2.start(); lfo.start();
    return [o, o2, lfo];
  }

  // Müzik kutusu notası: sinüs + ince üst harmonik, hızlı atak, uzun sönüm
  function musicBox(f, t) {
    tone(f, t, 2.2, { attack: 0.005, vol: 0.03, dest: reverb });
    tone(f, t, 1.4, { attack: 0.005, vol: 0.022, dest: musicGain });
    tone(f * 3, t, 0.5, { attack: 0.003, vol: 0.006, dest: reverb });
  }

  // Derinden kazan fokurtusu: kısa, alçak, yukarı kayan "blup"
  function bubble(t) {
    var f = 110 + Math.random() * 70;
    tone(f, t, 0.22, { slideTo: f * 2.2, vol: 0.02, dest: reverb });
  }

  function playBar() {
    var t = ctx.currentTime, i = chordIdx++ % CHORDS.length, ch = CHORDS[i];
    ch.forEach(function (f, k) {
      // Yumuşak ped: hafif akortsuz iki katman = sıcak, "büyülü" titreşim
      tone(f, t + k * 0.08, BAR + 0.6, { attack: 2.8, vol: 0.05, dest: musicGain });
      tone(f * 1.003, t + k * 0.08, BAR + 0.6, { attack: 3.2, vol: 0.03, dest: reverb });
    });
    // Motif her iki barda bir çalar (arada nefes payı kalsın)
    if (i % 2 === 0) {
      var m = MOTIFS[(chordIdx >> 1) % MOTIFS.length], start = t + 1.2;
      m.forEach(function (f, n) { musicBox(f, start + n * 0.7); });
    } else if (Math.random() < 0.6) {
      musicBox(MOTIFS[i][MOTIFS[i].length - 1] * 2, t + 3 + Math.random() * 2);
    }
    var n = 1 + Math.floor(Math.random() * 3);
    for (var b = 0; b < n; b++) bubble(t + 0.5 + Math.random() * (BAR - 1));
  }

  RT.updateMusic = function () {
    if (!ctx) return;
    var on = RT.save.settings.musicVol > 0 && ctx.state === "running";
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(on ? musicLevel() : 0, ctx.currentTime + 0.4);
    if (on && !musicTimer) {
      if (!reverb) reverb = makeReverb();
      if (!drone) drone = startDrone();
      playBar();
      musicTimer = setInterval(playBar, BAR * 1000);
    } else if (!on && musicTimer) {
      clearInterval(musicTimer); musicTimer = null;
      if (drone) { drone.forEach(function (o) { o.stop(ctx.currentTime + 0.5); }); drone = null; }
    }
  };

  // Uygulama arka plana geçince müziği durdur (telefonda önemli)
  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else { ctx.resume().then(RT.updateMusic); }
  });
})();
