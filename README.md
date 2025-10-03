Создаст базу и зальет тестовые данные
```bash
yarn setup
```
DEV режим
```bash
yarn dev
```
На "прод"
```bash
yarn start
```
Docker
```bash
docker build -t task-manager .
docker run --name task-manager -p 3000:3000 -p 3001:3001 task-manager
```
