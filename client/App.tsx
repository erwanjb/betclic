import React, { useEffect, useState }  from 'react';
import axiosIns from 'axios';
import { makeStyles, Paper, Typography, Select, MenuItem, Menu, TextField, Button, IconButton, Modal } from '@material-ui/core';
import { useForm } from "react-hook-form";
import { MoreVert } from '@material-ui/icons';

const axios = axiosIns.create({ baseURL: process.env.API_URL });

const useStyle = makeStyles({
    body: {
        display: 'flex'
    },
    contentPlayer: {
        display: 'flex', 
        flexWrap: 'wrap',
        width: '50%'
    },
    formAdd: {
        marginTop: 100,
        marginBottom: 100
    },
    card: {
        width: 100,
        margin: 20,
        padding: 10
    },
    modal: {
        backgroundColor: '#fff',
        width: 300,
        height: 300,
        top: 'calc(50vh - 150px) !important',
        position: 'absolute',
        left: 'calc(50vw - 150px) !important'
    },
    formUp: {
        backgroundColor: '#fff'
    }
})

const App = () => {

    const [order, setOrder] = useState(false);
    const [reload, setReload] = useState(false);
    const [players, setPlayers] = useState([]);
    const [playerOrdered, setPlayersOrdered] = useState([]);
    const [playerSelected, setPlayerSelected] = useState(null as string);

    const classes = useStyle();

    const [openModal, setOpenModal] = useState(false);

    const [anchorEl, setAnchorEl] = useState([]);

    const { register, handleSubmit } = useForm();

    const handleCloseModal = () => {
        setPlayerSelected(null);
        setOpenModal(false);
    }

    const handleClick = (index, event) => {
        const anchor = [...anchorEl];
        anchor[index] = event.currentTarget;
        setAnchorEl(anchor);
    };

    const handleClose = (pseudo) => {
        console.log(pseudo)
        setPlayerSelected(pseudo ? pseudo : null);
        setAnchorEl(players.map(() => null));
        setOpenModal(true);
    };

    useEffect(() => {
        setAnchorEl(players.map(() => null));
    }, [players]);

    useEffect(() => {
        const start = async () => {
            if (reload !== null) {
                const getPlayers = await axios.get('/api/players');
                const getPlayerOrdered = await axios.get('/api/players/sortByPoints');
                setPlayersOrdered(getPlayerOrdered.data.players);
                if (!order) {
                    setPlayers(getPlayers.data.players);
                } else {
                    setPlayers(getPlayerOrdered.data.players.reverse());
                }
            }
        }
        start();
    }, [reload, order]);

    const onSubmitAdd = async ({pseudo}) => {
        await axios.post('/api/players', { pseudo });
        setReload(!reload);
    }

    const onSubmitUpdate = async ({points}) => {
        console.log(playerSelected)
        await axios.put('/api/players/' + playerSelected, { points });
        setPlayerSelected(null);
        setOpenModal(false);
        setReload(!reload);
    }

    const handleOrder = (bool) => {
        setOrder(bool);
    }

    const handleDelete = async () => {
        await axios.delete('/api/players');
        setReload(!reload);
    }

    return (
        <div>
            <h1>Betclic Joueurs</h1>
            <div className={classes.body}>
                <div className={classes.contentPlayer}>
                    {
                        players.map((player, index) => {
                            return (
                                <Paper className={classes.card} elevation={3} variant="elevation">
                                    <Typography>{player.pseudo}</Typography>
                                    <p>points : {player.points ? player.points : 'aucun'}</p>
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick.bind(null, index)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        id="long-menu"
                                        anchorEl={anchorEl[index]}
                                        open={Boolean(anchorEl[index])}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose.bind(null, player.pseudo)}>
                                            Changer les points
                                        </MenuItem>
                                    </Menu>
                                </Paper>
                            )
                        })
                    }
                </div>
                <div>
                    <Select
                        labelId="demo-simple-select-label"
                        defaultValue={1}
                    >
                        <MenuItem onClick={handleOrder.bind(null, false)} value={1}>Désordonné</MenuItem>
                        <MenuItem onClick={handleOrder.bind(null, true)} value={2}>Ordonné</MenuItem>
                    </Select>
                    <div>
                        <form className={classes.formAdd} onSubmit={handleSubmit(onSubmitAdd)}>
                            <Typography>Ajouter un joueur</Typography>
                            <TextField name="pseudo" label="Pseudo" inputRef={register} />
                            <Button variant="outlined" color="primary" type="submit">Ajouter</Button>
                        </form>
                    </div>
                    <Typography>Supprimer tous les joueurs</Typography> 
                    <Button variant="outlined" color="secondary" onClick={handleDelete}>Supprimer</Button>
                </div>
            </div>
            <Modal
                className={classes.modal}
                open={openModal}
                onClose={handleCloseModal}
            >
                <form className={classes.formUp} onSubmit={handleSubmit(onSubmitUpdate)}>
                    <Typography>Modifier les points du joueur {playerSelected}</Typography>
                    <TextField type="number" name="points" label="Points" inputRef={register} />
                    <Button variant="outlined" color="primary" type="submit">Modifier</Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseModal}>Annuler</Button>
                </form>
            </Modal>
        </div>
    );
}

export default App;

