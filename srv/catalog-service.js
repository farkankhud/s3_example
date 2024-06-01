const debug = require('debug')('srv:catalog-service');
const log = require('cf-nodejs-logging-support');
log.setLoggingLevel('info');
log.registerCustomFields(["country", "amount"]);

module.exports = cds.service.impl(async function () {


    const {
            Sales
          } = this.entities;

    this.after('READ', Sales, (each) => {
        if (each.amount > 500) {
            if (each.comments === null)
                each.comments = '';
            else
                each.comments += ' ';
            each.comments += 'Exceptional!';
            debug(each.comments, {"country": each.country, "amount": each.amount});
                        log.info(each.comments, {"country": each.country, "amount": each.amount});
        }
    });

    this.on('boost', async req => {
        try {
            const ID = req.params[0];
            const tx = cds.tx(req);
            await tx.update(Sales)
                .with({ amount: { '+=': 250 }, comments: 'Boosted!' })
                .where({ ID: { '=': ID } })
                ;
            debug('Boosted ID:', ID);
            return {};
        } catch (err) {
            console.error(err);
            return {};
        }
    });

    this.on('topSales', async (req) => {
        try {
            const tx = cds.tx(req);
            const results = await tx.run(`CALL "s3_example.db::SP_TopSales"(?,?)`, [req.data.amount]);
            return results;
        } catch (err) {
            console.error(err);
            return {};
        }
    });





});