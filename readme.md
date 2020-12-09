Le back est en node, le front en react

variables d'environnement obligatoires dans un .env à la racine :

- PORT => le port du server back
- API_URL => exemple:  http://localhost/ PORT
- CLIENT_URL => exemple http://localhost/8000
- ACCESS_KEY_ID => l'id pour AWS et dynamodb
- SECRET_ACCESS_KEY => la key pour AWS et dynamodb

commandes a effectuer en dev :

`npm install` pour build les dépendances
`npm run build-api` pour démarrer le back
`npm run start-react` pour démarrer le front