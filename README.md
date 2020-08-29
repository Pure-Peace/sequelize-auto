# Sequelize-Auto For Eggjs
Base on [Sequelize-Auto]('https://github.com/sequelize/sequelize-auto)

**Support typescript option**

## Install
```
npm install -g egg-sequelize-ts-auto  or  npm install egg-sequelize-ts-auto
```
you also have to install `@types/sequelize` in you eggjs project

```
npm i @types/sequelize
```


## typescript example
###### In you eggjs project root
```
./node_modules/.bin/egg-sequelize-ts-auto -d database -h localhost -p 3306 -u root -x 1234 --dialect mysql -o app/model -z -g model
```
###### install global npm
```
  egg-sequelize-ts-auto -d database -h localhost -p 3306 -u root -x 1234 --dialect mysql -o app/model -z -g model
```
`-z` for typescript , `-g model` load model at `ctx.model`

you will get some ts file in app/model

**Now you can go on with typescript**



