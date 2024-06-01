using {RideLogger.db as db} from '../db/data-model';




service CatalogService @(path : '/catalog')
{
    entity Sales
      as select * from db.Sales
      actions {
        action boost();
      }
    ;

    function topSales
      (amount: Integer)
      returns many Sales;




};
