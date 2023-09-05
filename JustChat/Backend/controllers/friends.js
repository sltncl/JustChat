const User = require('../models/users')
const Friendship = require('../models/friends')

module.exports = {

    addFriend: (req, res) => {
        const username = req.body.username;
        const friendUsername = req.body.friendUsername;

        Promise.all([
            User.findOne({ username }),
            User.findOne({ username: friendUsername })
        ])
            .then(([user, friend]) => {
                if (!user || !friend) {
                    res.json({ error: 'User or friend not found' });
                } else {
                    Friendship.findOne({ user: user._id })
                        .then((friendship) => {
                            if (!friendship) {
                                const newFriendship = new Friendship({
                                    user: user._id,
                                    friends: [],
                                    sentRequests: [],
                                    receivedRequests: []
                                });
                                newFriendship.save()
                                    .then(() => {
                                        if (friendship && friendship.friends.includes(friend._id)) {
                                            res.json({ error: 'Users are already friends' });
                                        } else {
                                            Friendship.findOneAndUpdate(
                                                { user: user._id },
                                                { $push: { sentRequests: friend._id } }
                                            )
                                                .then(() => {
                                                    Friendship.findOneAndUpdate(
                                                        { user: friend._id },
                                                        { $push: { receivedRequests: user._id } },
                                                        { upsert: true, new: true }
                                                    )
                                                        .then(() => res.json({ success: true }))
                                                        .catch((error) => res.json({ error: error.message }));
                                                })
                                                .catch((error) => res.json({ error: error.message }));
                                        }
                                    })
                                    .catch((error) => res.json({ error: error.message }));
                            } else {
                                const existingSentRequest = friendship.sentRequests.includes(friend._id);
                                const existingReceivedRequest = friendship.receivedRequests.includes(friend._id);
                                if (existingSentRequest || existingReceivedRequest) {
                                    res.json({ error: 'Friend request already sent or received' });
                                } else if (friendship.friends.includes(friend._id)) {
                                    res.json({ error: 'Users are already friends' });
                                } else {
                                    Friendship.findOneAndUpdate(
                                        { user: user._id },
                                        { $push: { sentRequests: friend._id } },
                                        { upsert: true, new: true }
                                    )
                                        .then(() => {
                                            Friendship.findOneAndUpdate(
                                                { user: friend._id },
                                                { $push: { receivedRequests: user._id } },
                                                { upsert: true, new: true }
                                            )
                                                .then(() => res.json({ success: true }))
                                                .catch((error) => res.json({ error: error.message }));
                                        })
                                        .catch((error) => res.json({ error: error.message }));
                                }
                            }
                        })
                        .catch((error) => res.json({ error: error.message }));
                }
            })
            .catch((error) => res.json({ error: error.message }));
    },

    removeFriend: (req, res) => {
        const username = req.params.username;
        const friendUsername = req.params.friendUsername;

        Promise.all([
            User.findOne({ username }),
            User.findOne({ username: friendUsername })
        ])
            .then(([user, friend]) => {
                if (!user || !friend) {
                    return res.json({ error: 'User or friend not found' });
                }

                Friendship.findOne({ user: user._id })
                    .then((userFriendship) => {
                        if (!userFriendship) {
                            return res.json({ error: 'User\'s friendship not found' });
                        }

                        const userFriendIndex = userFriendship.friends.indexOf(friend._id);
                        if (userFriendIndex === -1) {
                            return res.json({ error: 'Friend not found in the user\'s friendship' });
                        }

                        userFriendship.friends.splice(userFriendIndex, 1);
                        userFriendship.save()
                            .then(() => {
                                Friendship.findOne({ user: friend._id })
                                    .then((friendFriendship) => {
                                        if (!friendFriendship) {
                                            return res.json({ error: 'Friend\'s friendship not found' });
                                        }

                                        const friendFriendIndex = friendFriendship.friends.indexOf(user._id);
                                        if (friendFriendIndex === -1) {
                                            return res.json({ error: 'User not found in the friend\'s friendship' });
                                        }

                                        friendFriendship.friends.splice(friendFriendIndex, 1);
                                        friendFriendship.save()
                                            .then(() => {
                                                return res.json({ success: true });
                                            })
                                            .catch((error) => {
                                                return res.json({ error: error.message });
                                            });
                                    })
                                    .catch((error) => {
                                        return res.json({ error: error.message });
                                    });
                            })
                            .catch((error) => {
                                return res.json({ error: error.message });
                            });
                    })
                    .catch((error) => {
                        return res.json({ error: error.message });
                    });
            })
            .catch((error) => {
                return res.json({ error: error.message });
            });
    },

    acceptFriendRequest: (req, res) => {
        const username = req.body.username; // utente che ha inviato la richiesta di amicizia
        const friendUsername = req.body.friendUsername; // utente che ha ricevuto la richiesta di amicizia

        Promise.all([
            User.findOne({ username: username }),
            User.findOne({ username: friendUsername })
        ])
            .then(([user, friend]) => {
                if (!user || !friend) {
                    res.json({ error: 'User or friend not found' });
                } else {
                    Friendship.findOne({ user: user._id })
                        .then((friendship) => {
                            if (!friendship) {
                                res.json({ error: 'Friendship not found' });
                            } else {
                                const isSentRequestExists = friendship.sentRequests.includes(friend._id);
                                Friendship.findOne({ user: friend._id })
                                    .then((friendFriendship) => {
                                        if (!friendFriendship) {
                                            res.json({ error: 'Friendship of friend not found' });
                                        } else {
                                            const isReceivedRequestExists = friendFriendship.receivedRequests.includes(user._id);
                                            if (!isSentRequestExists || !isReceivedRequestExists) {
                                                res.json({ error: 'Sent request or received request not found' });
                                            } else {
                                                Friendship.findOneAndUpdate(
                                                    { user: user._id },
                                                    { $pull: { sentRequests: friend._id } },
                                                    { new: true }
                                                )
                                                    .then((updatedFriendship) => {
                                                        if (!updatedFriendship) {
                                                            res.json({ error: 'Failed to update friendship' });
                                                        } else {
                                                            Friendship.findOneAndUpdate(
                                                                { user: friend._id },
                                                                { $pull: { receivedRequests: user._id } },
                                                                { new: true }
                                                            )
                                                                .then((updatedFriendFriendship) => {
                                                                    if (!updatedFriendFriendship) {
                                                                        res.json({ error: 'Failed to update friendship of friend' });
                                                                    } else {
                                                                        Friendship.findOneAndUpdate(
                                                                            { user: user._id },
                                                                            { $push: { friends: friend._id } },
                                                                            { new: true }
                                                                        )
                                                                            .then((updatedFriendship) => {
                                                                                if (!updatedFriendship) {
                                                                                    res.json({ error: 'Failed to update friendship' });
                                                                                } else {
                                                                                    Friendship.findOneAndUpdate(
                                                                                        { user: friend._id },
                                                                                        { $push: { friends: user._id } },
                                                                                        { new: true }
                                                                                    )
                                                                                        .then((updatedFriendFriendship) => {
                                                                                            if (!updatedFriendFriendship) {
                                                                                                res.json({ error: 'Failed to update friendship of friend' });
                                                                                            } else {
                                                                                                res.json({ success: true });
                                                                                            }
                                                                                        })
                                                                                        .catch((error) => res.json({ error: error.message }));
                                                                                }
                                                                            })
                                                                            .catch((error) => res.json({ error: error.message }));
                                                                    }
                                                                })
                                                                .catch((error) => res.json({ error: error.message }));
                                                        }
                                                    })
                                                    .catch((error) => res.json({ error: error.message }));
                                            }
                                        }
                                    })
                                    .catch((error) => res.json({ error: error.message }));
                            }
                        })
                        .catch((error) => res.json({ error: error.message }));
                }
            })
            .catch((error) => res.json({ error: error.message }));
    },

    rejectFriendRequest: (req, res) => {
        const username = req.body.username; // utente che ha inviato la richiesta di amicizia
        const friendUsername = req.body.friendUsername; // utente che ha ricevuto la richiesta di amicizia

        Promise.all([
            User.findOne({ username }),
            User.findOne({ username: friendUsername })
        ])
            .then(([user, friend]) => {
                if (!user || !friend) {
                    res.json({ error: 'User or friend not found' });
                } else {
                    Friendship.findOne({ user: user._id })
                        .then((friendship) => {
                            if (!friendship) {
                                res.json({ error: 'Friendship not found' });
                            } else {
                                const isSentRequestExists = friendship.sentRequests.includes(friend._id);
                                Friendship.findOne({ user: friend._id })
                                    .then((friendFriendship) => {
                                        if (!friendFriendship) {
                                            res.json({ error: 'Friendship of friend not found' });
                                        } else {
                                            const isReceivedRequestExists = friendFriendship.receivedRequests.includes(user._id);
                                            if (!isSentRequestExists || !isReceivedRequestExists) {
                                                res.json({ error: 'Sent request or received request not found' });
                                            } else {
                                                Friendship.findOneAndUpdate(
                                                    { user: user._id },
                                                    { $pull: { sentRequests: friend._id } },
                                                    { new: true }
                                                )
                                                    .then((updatedFriendship) => {
                                                        if (!updatedFriendship) {
                                                            res.json({ error: 'Failed to update friendship' });
                                                        } else {
                                                            Friendship.findOneAndUpdate(
                                                                { user: friend._id },
                                                                { $pull: { receivedRequests: user._id } },
                                                                { new: true }
                                                            )
                                                                .then((updatedFriendFriendship) => {
                                                                    if (!updatedFriendFriendship) {
                                                                        res.json({ error: 'Failed to update friendship of friend' });
                                                                    } else {
                                                                        res.json({ success: true });
                                                                    }
                                                                })
                                                                .catch((error) => res.json({ error: error.message }));
                                                        }
                                                    })
                                                    .catch((error) => res.json({ error: error.message }));
                                            }
                                        }
                                    })
                                    .catch((error) => res.json({ error: error.message }));
                            }
                        })
                        .catch((error) => res.json({ error: error.message }));
                }
            })
            .catch((error) => res.json({ error: error.message }));
    },

    getFriendsList: (req, res) => {
        const userId = req.params.userId; // ID dell'utente

        Friendship.findOne({ user: userId })
            .populate('friends', 'username firstName lastName')
            .populate('sentRequests', 'username')
            .populate('receivedRequests', 'username')
            .then(friendship => {
                if (!friendship) {
                    return res.json({ message: 'No friendship found for the user' });
                }
                return res.json({friendList: friendship});
            })
            .catch(error => res.json({ error: error.message }));
    },

    getSentRequests: (req, res) => {
        const userId = req.params.userId; // ID dell'utente

        Friendship.findOne({ user: userId })
            .populate('sentRequests', 'username firstName lastName')
            .then(friendship => {
                if (!friendship) {
                    return res.json({ message: 'No friendship found for the user' });
                }
                return res.json({sentRequests: friendship.sentRequests});
            })
            .catch(error => res.json({ error: error.message }));
    },

    getReceivedRequests: (req, res) => {
        const userId = req.params.userId; // ID dell'utente

        Friendship.findOne({ user: userId })
            .populate('receivedRequests', 'username firstName lastName')
            .then(friendship => {
                if (!friendship) {
                    return res.json({ message: 'No friendship found for the user' });
                }
                return res.json({receivedRequests: friendship.receivedRequests});
            })
            .catch(error => res.json({ error: error.message }));
    },

}