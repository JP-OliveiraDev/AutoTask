const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
};

exports.addFavorite = async (req, res) => {
  const { question, reply } = req.body;
  try {
    const favorite = new Favorite({ userId: req.userId, question, reply });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar favorito' });
  }
};

exports.deleteFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await Favorite.findOneAndDelete({ _id: id, userId: req.userId });
    if (!favorite) return res.status(404).json({ error: 'Favorito não encontrado' });
    res.json({ message: 'Favorito removido' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir favorito' });
  }
};
