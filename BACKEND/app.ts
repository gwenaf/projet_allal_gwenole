import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import * as cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

import routes from './routes/index';
import users from './routes/user';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import paymentRoutes from './routes/payment.routes';


interface CustomError extends Error {
    status?: number;
}


dotenv.config();

const debug = require('debug')('my express app');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

//app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', routes);


app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/payment', paymentRoutes);


// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const err: CustomError = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err[ 'status' ] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    debug(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});