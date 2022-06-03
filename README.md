## Installation du Pannel

Suivre les etapes suivantes :


- Verifier que linux est à jour :
    ```shell
    sudo apt update
    sudo apt upgrade
    ```

- Installation de CURL :
    ```shell
    sudo apt install -y curl
    ```
    
- On télécharge ensuite le script d'installation de Node 16
    ```shell
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    ```
    
- Installation de Node Js
    ```shell
    sudo apt install -y nodejs
    ```

- Verifions que Node est bien installer :
    ```shell
    node --version
    npm --version
    ```


- On entre dans le repertoire et on installe les dépendances necessaire :
    ```shell
    npm install
    ```

- Demarrer le serveur :
    ```shell
    npm start
    ```

