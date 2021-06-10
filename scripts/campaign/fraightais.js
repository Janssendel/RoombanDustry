const arr = [
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

// this a copy from SerpuloPlanetGenerator.
function Room(x, y, radius, gen) {
    this.connected = new ObjectSet();
    this.x = x, this.y = y;
    this.radius = radius;

    this.connected.add(this);

    this.connect = to => {
        if (this.connected.contains(to)) return;

        this.connected.add(to);

        let nscl = gen.rand.random(20, 60);
        let stroke = gen.rand.random(4, 12);
        
        this.brush(this.pathfind(x, y, to.x, to.y, tile => (tile.solid() ? 5 : 0) + gen.noise(tile.x, tile.y, 1, 1, 1 / nscl) * 60, Astar.manhattan), stroke);
    };

    return this;
}

// this a copy from SerpuloPlanetGenerator.
const fraightaisGenerator = extend(PlanetGenerator, {
    rawHeight(position) {
        position = Tmp.v33.set(position).scl(this.scl);
        return (Mathf.pow(this.noise.octaveNoise3D(7, 0.5, 1 / 3, position.x, position.y, position.z), 2.3) + this.waterOffset) / (1 + this.waterOffset);
    },

    generateSector(sector) {
        // these always have bases
        if (sector.id == 154 || sector.id == 0) {
            sector.generateEnemyBase = true;
            return;
        }

        let tile = sector.tile;

        let any = false;
        let poles = Math.abs(tile.v.y);
        let noise = Packages.arc.util.noise.Noise.snoise3(tile.v.x, tile.v.y, tile.v.z, 0.001, 0.58);

        if (noise + poles / 7.1 > 0.12 && poles > 0.23) {
            any = true;
        }

        if (noise < 0.16) {
            for (let other of tile.tiles) {
                var osec = sector.planet.getSector(other);

                // no sectors near start sector!
                if (
                    osec.id == sector.planet.startSector ||   // near starting sector
                    osec.generateEnemyBase && poles < 0.85 || // near other base
                    (sector.preset != null && noise < 0.11)   // near preset
                ) {
                    return;
                }
            }
        }

        sector.generateEnemyBase = any;
    },

    getHeight(position){
        let height = this.rawHeight(position);
        return Math.max(height, this.water);
    },

    getColor(position){
        let block = this.getBlock(position);
        // replace salt with sand color
        if (block == Blocks.salt) return Blocks.sand.mapColor;

        Tmp.c1.set(block.mapColor).a = 1 - block.albedo;

        return Tmp.c1;
    },

    genTile(position, tile){
        tile.floor = this.getBlock(position);
        tile.block = tile.floor.asFloor().wall;

        if (this.rid.getValue(position.x, position.y, position.z, 22) > 0.32) {
            tile.block = Blocks.air;
        }
    },

    getBlock(position) {
        let height = this.rawHeight(position);

        Tmp.v31.set(position);
        position = Tmp.v33.set(position).scl(this.scl);
            
        let rad = this.scl;
        let temp = Mathf.clamp(Math.abs(position.y * 2) / rad);
        let tnoise = this.noise.octaveNoise3D(7, 0.56, 1 / 3, position.x, position.y + 999, position.z);
            
        temp = Mathf.lerp(temp, tnoise, 0.5);
        height *= 1.2;
        height = Mathf.clamp(height);

        let tar = this.noise.octaveNoise3D(4, 0.55, 1 / 2, position.x, position.y + 999, position.z) * 0.3 + Tmp.v31.dst(0, 0, 1) * 0.2;
        let res = this.arr[Mathf.clamp(Math.floor(temp * this.arr.length), 0, this.arr[0].length - 1)][Mathf.clamp(Math.floor(height * this.arr[0].length), 0, this.arr[0].length - 1)];
            
        if (tar > 0.5) {
            return this.tars.get(res, res);
        } else {
            return res;
        }
    },

    noise(x, y, octaves, falloff, scl, mag) {
        let v = this.sector.rect.project(x, y).scl(5);
        return this.noise.octaveNoise3D(octaves, falloff, 1 / scl, v.x, v.y, v.z) * mag;
    },

    generate() {
        this.cells(4);
        this.distort(10, 12);

        let constraint = 1.3;
        let radius = this.width / 2 / Mathf.sqrt3;
        let rooms = this.rand.random(2, 5);
        let roomseq = new Seq();

        for (let i = 0; i < rooms; i++) {
            Tmp.v1.trns(this.rand.random(360), this.rand.random(radius / constraint));

            let rx = (this.width / 2 + Tmp.v1.x);
            let ry = (this.height / 2 + Tmp.v1.y);
            let maxrad = radius - Tmp.v1.len();
            let rrad = Math.min(this.rand.random(9, maxrad / 2), 30);
            
            roomseq.add(new Room(Math.floor(rx), Mathf.floor(ry), Mathf.floor(rrad)));
        }

        //check positions on the map to place the player spawn. this needs to be in the corner of the map
        let spawn = null;
        let enemies = new Seq();
        let enemySpawns = rand.random(1, Math.max(Math.floor(this.sector.threat * 4), 1));
        
        let offset = rand.nextInt(360);
        let length = width / 2.55 - rand.random(13, 23);
        let angleStep = 5;
        let waterCheckRad = 5;
        
        for (let i = 0; i < 360; i+= angleStep) {
            let angle = offset + i;
            let cx = Math.floor(this.width / 2 + Angles.trnsx(angle, length));
            let cy = Math.floor(this.height / 2 + Angles.trnsy(angle, length));

            let waterTiles = 0;

            //check for water presence
            for (let rx = -waterCheckRad; rx <= waterCheckRad; rx++) {
                for (let ry = -waterCheckRad; ry <= waterCheckRad; ry++) {
                    let tile = tiles.get(cx + rx, cy + ry);
                    if (tile == null || tile.floor().liquidDrop != null) {
                        waterTiles++;
                    }
                }
            }

            if (waterTiles <= 4 || (i + angleStep >= 360)) {
                roomseq.add(spawn = new Room(cx, cy, rand.random(8, 15), this));

                for (let j = 0; j < enemySpawns; j++) {
                    let enemyOffset = rand.range(60);
                    
                    Tmp.v1.set(cx - this.width / 2, cy - this.height / 2).rotate(180 + enemyOffset).add(this.width / 2, this.height / 2);
                    
                    let espawn = new Room(Mathf.floor(Tmp.v1.x), Math.floor(Tmp.v1.y), rand.random(8, 15), this);
                    
                    roomseq.add(espawn);
                    enemies.add(espawn);
                }

                break;
            }
        }

        for (let room of roomseq.toArray()) {
            this.erase(room.x, room.y, room.radius);
        }

        let connections = this.rand.random(Math.max(rooms - 1, 1), rooms + 3);
        
        for (let i = 0; i < connections; i++) {
            roomseq.random(this.rand).connect(roomseq.random(this.rand));
        }

        for (let room of roomseq.toArray()) {
            spawn.connect(room);
        }

        this.cells(1);
        this.distort(10, 6);

        this.inverseFloodFill(this.tiles.getn(spawn.x, spawn.y));

        let ores = Seq.with(Blocks.oreCopper, Blocks.oreLead);
        let poles = Math.abs(this.sector.tile.v.y);
        let nmag = 0.5, scl = 1, addscl = 1.3;

        if (this.noise.octaveNoise3D(2, 0.5, this.scl, this.sector.tile.v.x, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.25 * addscl) {
            ores.add(Blocks.oreCoal);
        }

        if (this.noise.octaveNoise3D(2, 0.5, this.scl, this.sector.tile.v.x + 1, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.5 * addscl) {
            ores.add(Blocks.oreTitanium);
        }

        if (this.noise.octaveNoise3D(2, 0.5, this.scl, this.sector.tile.v.x + 2, this.sector.tile.v.y, this.sector.tile.v.z) * nmag + poles > 0.7 * addscl) {
            ores.add(Blocks.oreThorium);
        }

        if (this.rand.chance(0.25)) {
            ores.add(Blocks.oreScrap);
        }

        let frequencies = new FloatSeq();
        
        for (let i = 0; i < ores.size; i++) {
            frequencies.add(rand.random(-0.1, 0.01) - i * 0.01 + poles * 0.04);
        }

        let floor = this.floor;
        let block = this.block;

        this.pass((x, y) => {
            if (!floor.asFloor().hasSurface()) return;

            let offsetX = x - 4, offsetY = y + 23;
            
            for (let i = ores.size - 1; i >= 0; i--) {
                let entry = ores.get(i);
                let freq = frequencies.get(i);
                
                if (Math.abs(0.5 - this.noise(offsetX, offsetY + i * 999, 2, 0.7, (40 + i * 2))) > 0.22 + i * 0.01 &&
                    Math.abs(0.5 - this.noise(offsetX, offsetY - i * 999, 1, 1, (30 + i * 4))) > 0.37 + freq) {
                    ore = entry;
                    break;
                }
            }

            if (ore == Blocks.oreScrap && this.rand.chance(0.33)) {
                floor = Blocks.metalFloorDamaged;
            }
        });

        this.trimDark();
        this.median(2);
        this.tech();

        this.pass((x, y) => {
            //random moss
            if (floor == Blocks.sporeMoss) {
                if (Math.abs(0.5 - this.noise(x - 90, y, 4, 0.8, 65)) > 0.02) {
                    floor = Blocks.moss;
                }
            }

            //tar
            if (floor == Blocks.darksand) {
                if (Math.abs(0.5 - this.noise(x - 40, y, 2, 0.7, 80)) > 0.25 &&
                    Math.abs(0.5 - this.noise(x, y + this.sector.id*10, 1, 1, 60)) > 0.41 && !(roomseq.contains(r => Mathf.within(x, y, r.x, r.y, 15)))) {
                    floor = Blocks.tar;
                    ore = Blocks.air;
                }
            }

            //hotrock tweaks
            if (floor == Blocks.hotrock) {
                if (Math.abs(0.5 - this.noise(x - 90, y, 4, 0.8, 80)) > 0.035) {
                    floor = Blocks.basalt;
                } else {
                    ore = Blocks.air;
                    let all = true;
                    
                    for (let p of Geometry.d4) {
                        let other = this.tiles.get(x + p.x, y + p.y);
                        
                        if (other == null || (other.floor() != Blocks.hotrock && other.floor() != Blocks.magmarock)) {
                            all = false;
                        }
                    }
                    if (all) {
                        floor = Blocks.magmarock;
                    }
                }
            } else if (floor != Blocks.basalt && floor != Blocks.ice && floor.asFloor().hasSurface()) {
                let noise = this.noise(x + 782, y, 5, 0.75, 260, 1);
                
                if (noise > 0.67 && !roomseq.contains(e => Mathf.within(x, y, e.x, e.y, 14))) {
                    if (noise > 0.72) {
                        floor = noise > 0.78 ? Blocks.taintedWater : (floor == Blocks.sand ? Blocks.sandWater : Blocks.darksandTaintedWater);
                    } else {
                        floor = (floor == Blocks.sand ? floor : Blocks.darksand);
                    }
                    ore = Blocks.air;
                }
            }

            if (this.rand.chance(0.0075)) {
                //random spore trees
                let any = false, all = true;
                
                for (let p of Geometry.d4) {
                    other = this.tiles.get(x + p.x, y + p.y);
                    
                    if (other != null && other.block() == Blocks.air) {
                        any = true;
                    } else {
                        all = false;
                    }
                }
                if (any && ((block == Blocks.snowWall || block == Blocks.iceWall) || (all && block == Blocks.air && floor == Blocks.snow && rand.chance(0.03)))) {
                    block = rand.chance(0.5) ? Blocks.whiteTree : Blocks.whiteTreeDead;
                }
            }

            for (let i = 0; i < 4; i++) {
                let near = Vars.world.tile(x + Geometry.d4[i].x, y + Geometry.d4[i].y);
                
                if (near != null && near.block() != Blocks.air) {
                    break;
                }

                if (rand.chance(0.01) && floor.asFloor().hasSurface() && block == Blocks.air) {
                    block = this.dec.get(floor, floor.asFloor().decoration);
                }
            }
        });

        let difficulty = this.sector.threat;
        
        this.ints.clear();
        this.ints.ensureCapacity(this.width * this.height / 4);

        // let ruinCount = this.rand.random(-2, 4);
        
        /* you can port this yourself if you want to, it's not necessary unless you want ruins in the sectors.
        if(ruinCount > 0){
            int padding = 25;
            //create list of potential positions
            for(int x = padding; x < width - padding; x++){
                for(int y = padding; y < height - padding; y++){
                    Tile tile = tiles.getn(x, y);
                    if(!tile.solid() && (tile.drop() != null || tile.floor().liquidDrop != null)){
                        ints.add(tile.pos());
                    }
                }
            }
            ints.shuffle(rand);
            int placed = 0;
            float diffRange = 0.4f;
            //try each position
            for(int i = 0; i < ints.size && placed < ruinCount; i++){
                int val = ints.items[i];
                int x = Point2.x(val), y = Point2.y(val);
                //do not overwrite player spawn
                if(Mathf.within(x, y, spawn.x, spawn.y, 18f)){
                    continue;
                }
                float range = difficulty + rand.random(diffRange);
                Tile tile = tiles.getn(x, y);
                BasePart part = null;
                if(tile.overlay().itemDrop != null){
                    part = bases.forResource(tile.drop()).getFrac(range);
                }else if(tile.floor().liquidDrop != null && rand.chance(0.05)){
                    part = bases.forResource(tile.floor().liquidDrop).getFrac(range);
                }else if(rand.chance(0.05)){ //ore-less parts are less likely to occur.
                    part = bases.parts.getFrac(range);
                }
                //actually place the part
                if(part != null && BaseGenerator.tryPlace(part, x, y, Team.derelict, (cx, cy) -> {
                    Tile other = tiles.getn(cx, cy);
                    if(other.floor().hasSurface()){
                        other.setOverlay(Blocks.oreScrap);
                        for(int j = 1; j <= 2; j++){
                            for(Point2 p : Geometry.d8){
                                Tile t = tiles.get(cx + p.x*j, cy + p.y*j);
                                if(t != null && t.floor().hasSurface() && rand.chance(j == 1 ? 0.4 : 0.2)){
                                    t.setOverlay(Blocks.oreScrap);
                                }
                            }
                        }
                    }
                })){
                    placed ++;
                    int debrisRadius = Math.max(part.schematic.width, part.schematic.height)/2 + 3;
                    Geometry.circle(x, y, tiles.width, tiles.height, debrisRadius, (cx, cy) -> {
                        float dst = Mathf.dst(cx, cy, x, y);
                        float removeChance = Mathf.lerp(0.05f, 0.5f, dst / debrisRadius);
                        Tile other = tiles.getn(cx, cy);
                        if(other.build != null && other.isCenter()){
                            if(other.team() == Team.derelict && rand.chance(removeChance)){
                                other.remove();
                            }else if(rand.chance(0.5)){
                                other.build.health = other.build.health - rand.random(other.build.health * 0.9f);
                            }
                        }
                    });
                }
            }
        }
        */

        Schematics.placeLaunchLoadout(spawn.x, spawn.y);

        let state = Vars.state;

        for (let espawn of enemies.toArray()) {
            this.tiles.getn(espawn.x, espawn.y).setOverlay(Blocks.spawn);
        }

        if (sector.hasEnemyBase()) {
            this.basegen.generate(this.tiles, enemies.map(r => this.tiles.getn(r.x, r.y)), this.tiles.get(spawn.x, spawn.y), state.rules.waveTeam, this.sector, difficulty);

            state.rules.attackMode = this.sector.info.attack = true;
        } else {
            state.rules.winWave = this.sector.info.winWave = 10 + 5 * Math.floor(Math.max(difficulty * 10, 1));
        }

        let waveTimeDec = 0.4;

        state.rules.waveSpacing = Mathf.lerp(60 * 65 * 2, 60 * 60 * 1, Math.max(difficulty - waveTimeDec, 0) / 0.8);
        state.rules.waves = this.sector.info.waves = true;
        state.rules.enemyCoreBuildRadius = 600;

        state.rules.spawns = Waves.generate(difficulty, new Rand(), state.rules.attackMode);
    },

    postGenerate(tiles) {
        if (this.sector.hasEnemyBase()) {
            this.basegen.postGenerate();
        }
    }
});
fraightaisGenerator.rid = new Packages.arc.util.noise.RidgedPerlin(1, 2);
fraightaisGenerator.basegen = new BaseGenerator();
fraightaisGenerator.scl = 5;
fraightaisGenerator.waterOffset = 0.007;
fraightaisGenerator.water = 2 / arr[0].length;
fraightaisGenerator.dec = ObjectMap.of(
    Blocks.sporeMoss, Blocks.sporeCluster,
    Blocks.moss, Blocks.sporeCluster,
    Blocks.taintedWater, Blocks.water,
    Blocks.darksandTaintedWater, Blocks.darksandWater
);
fraightaisGenerator.tars = ObjectMap.of(
    Blocks.sporeMoss, Blocks.shale,
    Blocks.moss, Blocks.shale
);
fraightaisGenerator.arr = arr;

const fraightais = extend(Planet, "fraightais", Planets.sun, 2, 1, {});
fraightais.generator = fraightaisGenerator;
fraightais.meshLoader = () => new HexMesh(fraightais, 6);
fraightais.orbitRadius = 5;
fraightais.orbitTime = 1.5 * 60;
fraightais.rotateTime = 30;
fraightais.bloom = true;
fraightais.accessible = true;
fraightais.startSector = 1;
fraightais.hasAtmosphere = true;
fraightais.atmosphereColor = Liquids.oil.color;
fraightais.atmosphereRadIn = 0.1;
fraightais.atmosphereRadOut = 0.5;
fraightais.alwaysUnlocked = true;
// fraightais.localizedName = "fraightais"; no, use bundles.

/* Uncomment this when the map is present.
// sector location changed to 1, you can change this later on if you want to.
const voidalCentral = new SectorPreset("voidal-central", fraightais, 1);
voidalCentral.captureWave = 30;
// voidalCentral.localizedName = "voidalCentral"; do not.
voidalCentral.difficulty = 10;
voidalCentral.alwaysUnlocked = true;
*/

/* WIP progress at something more like "planet themes"
{
	let music = loadMusic(".preparing_for_assault.ogg");

if (campaignmenuisshown && Vars.renderer.planets.planet == planet) {
    // stop current music ...
    // play the specified music ...
}
}