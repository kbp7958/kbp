var Race = artifacts.require('./Race.sol');

contract('Race', () => {
    let raceInstance;

    it('Verify number of horses', () => {
        return Race.deployed().then((instance) => {
            return instance.horseCount();
        }).then((count) => {
            assert.equal(count, 5);
        });
    });

    it('Verify individual horses', () => {
        return Race.deployed().then((instance) => {
            raceInstance = instance;
            return raceInstance.horses(0);
        }).then((horse) => {
            assert.equal(horse[0], 0, 'correct index');
            assert.equal(horse[1], 'Secretariat', 'correct name');
            return raceInstance.horses(1);
        }).then((horse) => {
            assert.equal(horse[0], 1, 'correct index');
            assert.equal(horse[1], 'Man O\' War', 'correct name');
            return raceInstance.horses(2);
        }).then((horse) => {
            assert.equal(horse[0], 2, 'correct index');
            assert.equal(horse[1], 'Seabiscuit', 'correct name');
            return raceInstance.horses(3);
        }).then((horse) => {
            assert.equal(horse[0], 3, 'correct index');
            assert.equal(horse[1], 'Phar Lap', 'correct name');
            return raceInstance.horses(4);
        }).then((horse) => {
            assert.equal(horse[0], 4, 'correct index');
            assert.equal(horse[1], 'Frankel', 'correct name');
        });
    });

});