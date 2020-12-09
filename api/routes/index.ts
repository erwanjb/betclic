import { Router } from 'express';
import { Player } from '../dynamo/dynamo';

const router = Router();

router.get('/players', async (req, res) => {
    await Player.scan()
    .loadAll()
    .exec((err, data) => {
        const players = data.Items.map((item: any) => item.attrs);
        res.send({ status: 'OK', players });
    });
});

router.get('/players/sortByPoints', async (req, res) => {
    await Player.scan()
    .loadAll()
    .exec((err, data) => {
        const players = data.Items.map((item: any) => item.attrs).sort((a: any, b: any) => {
            if (a.points === undefined && b.points !== undefined) {
                return -1;
            }
            if (b.points === undefined && a.points !== undefined) {
                return 1;
            }
            if (b.points === undefined && a.points === undefined) {
                return 0;
            }
            return a.points - b.points;
        });
        res.send({ status: 'OK', players });
    });
});

router.get('/players/:pseudo', async (req, res) => {
    await Player.scan()
    .where('pseudo')
    .equals(req.params.pseudo)
    .exec((err, data) => {
        const player = data.Items[0] ? data.Items[0].attrs : null;
        res.send({ status: 'OK', player });
    });
});

router.post('/players', async (req, res) => {
    const pseudo = req.body.pseudo;
    await Player.create({ pseudo });
    res.send({ status: 'OK', message: `Le joueur ${pseudo} a été créé` });
});

router.put('/players/:pseudo', async (req, res) => {
    const pseudo = req.params.pseudo;
    const points = req.body.points;
    await Player.update({ pseudo, points });
    res.send({ status: 'OK', message: `Le joueur ${pseudo} a été modifié avec ${points} points` });
})

router.delete('/players', async (req, res) => {
    await Player.scan()
    .loadAll()
    .exec((err, data) => {
        data.Items.forEach(async(item: any) => Player.destroy(item.attrs.pseudo));
        res.send({ status: 'OK', message: 'Tous les joueurs ont été supprimé' });
    });
})

export default router;