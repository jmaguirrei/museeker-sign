
// import _ from '@jmaguirrei/belt';
import testData from './testData';

export async function loadData(db) {

  /*
  */

  const active = false;

  if (active) {

    // Hack: Uses a timeout to wait the instance to be up before making a query
    setTimeout(async () => {

      const before = Date.now();
      Promise.all(
        testData.map(item => db.model.insertOne(item))
      )
      .then(ids => {
        console.log('ids --> ', ids);
        const after = Date.now();
        console.log('time: ', after - before);
      });
      // await db.model.insertMany(manyDocs);
      // const after = Date.now();
      // console.log('time: ', after - before);

      const results = await db.model.find({});
      console.log(`${results.length} documents inserted`);

    }, 3000);
  }


}

