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



    const ananyum = new Planet("ananyum", Planets.sun, 2, 1);
    ananyum.generator = hhhaGenerator;
    ananyum.mesh = new HexMesh(ananyum, 3);
    ananyum.orbitRadius = 5;
    ananyum.orbitTime = 1.5 * 60;
    ananyum.rotateTime = 30;
    ananyum.bloom = true;
    ananyum.accessible = true;
    ananyum.startSector = 1;
    ananyum.hasAtmosphere = true;
    ananyum.atmosphereColor = Liquids.oil.color;
    ananyum.atmosphereRadIn = 0.1;
    ananyum.atmosphereRadOut = 0.5;
    ananyum.alwaysUnlocked = true;
    ananyum.localizedName = "Fraightais";




    const Voidal-Central = new SectorPreset("Voidal-Central", ananyum, 205);
    Voidal-Central.captureWave = 30;
    Voidal-Central.localizedName = "Voidal-Central";
    Voidal-Central.difficulty = 10;
    Voidal-Central.alwaysUnlocked = true;


});