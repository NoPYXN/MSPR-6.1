module.exports = {
    process() {
        return 'module.exports = {};';
    },
    getCacheKey() {
        // Le fichier transformateur est en mémoire cache sur la base du contenu du fichier.
        return 'styleTransform';
    },
};
