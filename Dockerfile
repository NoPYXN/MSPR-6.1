# Utiliser une image de base avec Node.js et Yarn
FROM node:16

# Installer les dépendances de base
RUN apt-get update && apt-get install -y openjdk-11-jdk wget unzip

# Définir les variables d'environnement pour Android SDK
ENV ANDROID_SDK_ROOT=/usr/lib/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/tools/bin:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/tools/bin:$ANDROID_SDK_ROOT/platform-tools

# Créer le répertoire pour Android SDK
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools

# Installer Android SDK
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -O android_cmdline_tools.zip \
    && unzip android_cmdline_tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
    && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/tools \
    && rm android_cmdline_tools.zip \
    && yes | sdkmanager --licenses \
    && yes | sdkmanager --sdk_root=$ANDROID_SDK_ROOT "platform-tools" "platforms;android-30" "build-tools;30.0.3"

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et yarn.lock pour installer les dépendances
COPY package.json yarn.lock ./

# Changer le registre npm pour éviter les erreurs de réseau
RUN yarn config set registry https://registry.yarnpkg.com

# Installer les dépendances avec cache local
RUN yarn install --network-timeout 100000

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port pour le serveur de développement React Native
EXPOSE 8081

# Commande par défaut pour démarrer le serveur de développement
CMD ["expo", "start", "--web"]
