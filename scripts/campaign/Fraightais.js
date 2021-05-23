Events.on(ClientLoadEvent, () => {

    var arrrrs = [
        [Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.stone, Blocks.stone],
        [Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.stone, Blocks.stone, Blocks.stone],
        [Blocks.water, Blocks.grass, Blocks.grass, Blocks.sand, Blocks.salt, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.stone, Blocks.stone, Blocks.stone],
        [Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.salt, Blocks.salt, Blocks.salt, Blocks.sand, Blocks.stone, Blocks.stone, Blocks.stone, Blocks.snow, Blocks.iceSnow, Blocks.ice],
        [Blocks.deepwater, Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.salt, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice],
        [Blocks.deepwater, Blocks.water, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.iceSnow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.snow, Blocks.ice],
        [Blocks.deepwater, Blocks.sandWater, Blocks.sand, Blocks.sand, Blocks.grass, Blocks.grass, Blocks.snow, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.ice, Blocks.snow, Blocks.ice],
        [Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.hotrock, Blocks.grass, Blocks.ice, Blocks.snow, Blocks.ice, Blocks.ice],
        [Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dirt, Blocks.snow, Blocks.grass, Blocks.grass, Blocks.ice, Blocks.snow, Blocks.ice, Blocks.ice],
        [Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dirt, Blocks.ice, Blocks.ice, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice],
        [Blocks.water, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.grass, Blocks.ice, Blocks.ice, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice],
        [Blocks.grass, Blocks.grass, Blocks.grass, Blocks.dirt, Blocks.grass, Blocks.dirt, Blocks.iceSnow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice],
        [Blocks.grass, Blocks.grass, Blocks.snow, Blocks.ice, Blocks.iceSnow, Blocks.snow, Blocks.snow, Blocks.snow, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice, Blocks.ice]
    ];
    const hhhaGenerator = extend(SerpuloPlanetGenerator, {
        getBlock(p){
            this.arr = arrrrs;
            this.super$getBlock(p);
        }
    });
    hhhaGenerator.arr = arrrrs;



    const ananyum = new Planet("Fraightais", Planets.sun, 2, 1);
    Fraightais.generator = hhhaGenerator;
    Fraightais.mesh = new HexMesh(ananyum, 3);
    Fraightais.orbitRadius = 5;
    Fraightais.orbitTime = 1.5 * 60;
    Fraightais.rotateTime = 30;
    Fraightais.bloom = true;
    Fraightais.accessible = true;
    Fraightais.startSector = 1;
    Fraightais.hasAtmosphere = true;
    Fraightais.atmosphereColor = Liquids.oil.color;
    Fraightais.atmosphereRadIn = 0.1;
    Fraightais.atmosphereRadOut = 0.5;
    Fraightais.alwaysUnlocked = true;
    Fraightais.localizedName = "Fraightais";




    const Voidal-Central = new SectorPreset("Voidal-Central", Fraightais, 205);
    Voidal-Central.captureWave = 30;
    Voidal-Central.localizedName = "Voidal-Central";
    Voidal-Central.difficulty = 10;
    Voidal-Central.alwaysUnlocked = true;


});