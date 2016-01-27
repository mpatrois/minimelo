'use strict';

// Wait for Cordova to load
document.addEventListener('deviceready', deviceReady, false);

// Cordova is ready
function deviceReady() {
  // var db = window.sqlitePlugin.openDatabase({name: "my.db"});

  // db.transaction(function(tx) {
  //   tx.executeSql('DROP TABLE IF EXISTS test_table');
  //   tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

  //   // demonstrate PRAGMA:
  //   db.executeSql("pragma table_info (test_table);", [], function(res) {
  //     debug("PRAGMA res: " + JSON.stringify(res)); 
  //   });

  //   tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
  //     debug("insertId: " + res.insertId + " -- probably 1");
  //     debug("rowsAffected: " + res.rowsAffected + " -- should be 1");

  //     db.transaction(function(tx) {
  //       tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
  //         debug("res.rows.length: " + res.rows.length + " -- should be 1");
  //         debug("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
  //       });
  //     });

  //   }, function(e) {
  //     debug("ERROR: " + e.message);
  //   });
  // });
}
