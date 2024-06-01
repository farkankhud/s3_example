using { s3_example.db as db  } from '../db/data-model';


service StudentService @(path : '/Students')  {

    entity StudentSet as projection on db.Students ;
    

    

}