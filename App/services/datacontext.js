define([
    'durandal/system',
    'durandal/app',
    'services/model',
    'config',
    'services/logger',
    'services/appsecurity'
],
  function (system, app, model, config, logger, appsecurity) {
      var EntityQuery = breeze.EntityQuery,
            manager = configureBreezeManager(); //шорткаты для "бриз" сервисов
      var entityNames = model.entityNames;  
      var imageSettings = config.imageSettings;

      var getTests = function (testsObservable, options) {
          if (testsObservable) {
              var query = EntityQuery.from('Tests')
                      .orderBy('name');

              function querySucceeded(data) {
                  if (testsObservable) {
                      testsObservable(data.results);
                  }
                  //log('Retrieved [Tests] from remote data source!', data, true);
              };

              return manager.executeQuery(query)
                  .then(querySucceeded)
                  .fail(queryFailed);
          }
          if (options) {
              var filteredTests = _(options.results()).filter(function (test) {
                  var match = options.filter.predicate(options.filter, test);
                  return match;
              });
              options.results(filteredTests);
          }

      };
      
      var getOwnersFromTests = function (tests)
      {
          var owners = _.map(tests(), function (test) {
              return test.owner();
          });
          var uniqOwners = _.uniq(owners, function (owner) {
              return owner.login();
          });
          return uniqOwners;
      }

      var getLocalTest = function (testsObservable) {

          return getLocal('Tests', 'name')
              .then(querySucceeded)
              .fail(queryFailed);

          function querySucceeded(data) {
              if (testsObservable) {
                  testsObservable(data.results);
              }
              //log('Retrieved [Tests] from local data source!', data, true);
          };
      };

      var getUsers = function (usersObservable) {
          var query = EntityQuery.from('Users')
                    .expand("CreatedTests")
                  .orderBy('firstName', 'lastName');

          return manager.executeQuery(query)
              .then(querySucceeded)
              .fail(queryFailed);

          function querySucceeded(data) {
              if (usersObservable) {
                  usersObservable(data.results);
              }
              //log('Retrieved [Users] from remote data source!', data, true);
          };
      };

      var getTestById = function (testId, testObservable) {
          return manager.fetchEntityByKey(
                entityNames.test, testId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);

          function fetchSucceeded(data) {
              var t = data.entity;
              return refreshTest(t);
          }

          function refreshTest(test) {
              return EntityQuery.fromEntities(test)
                  .expand(["Owner", "Restriction"])
                  .using(manager).execute()
                  .then(querySucceeded)
                  .fail(queryFailed);
          }

          function querySucceeded(data) {
              var t = data.results[0];
              //log('Retrieved [Test] from remote data source!', t, true);
              return testObservable(t);
          }
      };

      var getUserTests = function (userId, userTestsObservable) {
          var query = EntityQuery.from("UsersInTests")
                        .select("test")
                        .where("userId", "eq", userId);

          return manager.executeQuery(query)
              .then(querySucceeded)
              .fail(queryFailed);

          function querySucceeded(data) {
              if (userTestsObservable) {
                  userTestsObservable(data.results);
              }
              //log('Retrieved [Tests] for user from remote data source!', data, true);
          };
      };

      var getUserById = function (userId, userObservable) {

          if (userObservable) {
              return manager.fetchEntityByKey(
                    entityNames.user, userId, true)
                    .then(fetchSucceeded)
                    .fail(queryFailed);
          }
          else
          {
              manager.fetchEntityByKey(
                    entityNames.user, userId, true)
                    .then(querySucceeded)
                    .fail(queryFailed);
          }

          function fetchSucceeded(data) {
              var u = data.entity;
              return refreshUser(u);
          }

          function refreshUser(user) {
              return EntityQuery.fromEntities(user)
                  .expand(["Statistics"])
                  .using(manager).execute()
                  .then(querySucceeded)
                  .fail(queryFailed);
          }

          function querySucceeded(data) {
              var u = data.results[0];
              //log('Retrieved info about user!', u, true);
              if (userObservable)
                  return userObservable(u);
              else
                  return u;
          }
      };

      var getQuestionsByTestId = function (testId, questionsObservable) {
          var query = EntityQuery.from("Questions")
                        .select("id, questionText, testId, answers, questionType, imageSource")
                        .where("testId", "eq", testId);

          return manager.executeQuery(query)
              .then(querySucceeded)
              .fail(queryFailed);

          function querySucceeded(data) {
              if (questionsObservable) {
                  data.results.forEach(function (q) {
                      q.chosenAnswers = ko.observable("");
                      q.checkedAnswer = ko.observable();

                      q.checkedAnswer.subscribe(function (oldValue) {
                          this.answers.forEach(function (a) {
                              if (a.id() == oldValue) {
                                  a.isCorrectAnswer(false);
                              }
                          });
                      }, q, "beforeChange");

                      q.checkedAnswer.subscribe(function (newValue) {
                          this.answers.forEach(function (a) {
                              if (a.id() == newValue) {
                                  a.isCorrectAnswer(true);
                              }
                          });
                      }, q);

                      q.imageName = ko.computed(function () {
                          if (!q.imageSource)
                              return false;
                          return imageSettings.imageQuestionBasePath +
                            (q.imageSource || imageSettings.unknownQuestionImageSource);
                      });

                      q.answers.forEach(function (a) {
                          a.checked = ko.observable(false);
                      });
                  });
                  questionsObservable(data.results);
              }
              //log('Retrieved [Questions-list] from remote data source!', data, true);
          };
      };

      var getTestDetails = function (testId, testDescriptionObservable) {
          var query = EntityQuery.from("Tests")
                        .select("restriction")
                        .where("id", "eq", testId);
          return manager.executeQueryLocally(query)[0].restriction;
      };

      var getQuestionTypes = function (qTypesObservable)
      {
          var query = EntityQuery.from('QuestionTypes')
                        .select("id, key, description")
                        .orderBy("key");
          return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

          function querySucceeded(data) {
              if (qTypesObservable) {
                  qTypesObservable(data.results);
              }
              //log('Retrieved [QuestionTypes] from remote data source!', data, true);
          };
      }

      var createTestEntity = function (restrId) {
          return manager.createEntity("Test", {
              restrictionId: restrId
          });
      };

      var createEntity = function (initValues, entity) {
          if (!initValues)
              return manager.createEntity(entity);
          else
            return manager.createEntity(entity, initValues);
      };

      var saveTestEntity = function (testObserv, testRestObserv) {
          var test = {
              name: testObserv().name(),
              description: testObserv().description(),
              tags: testObserv().tags(),
              ownerId: testObserv().ownerId(),
              restriction: {
                  timeLimit: testRestObserv().timeLimit(),
                  attemptsNumber: testRestObserv().attemptsNumber(),
                  isPrivate: testRestObserv().isPrivate(),
              }
          };
          var promise = $.post("api/test/savetest", test).done(function (answer) {
              var a = answer;
          });
          return promise;
      };

      var extendEntities = function (test, testRestriction) {
          test().name.extend({ required: true });
          test().tags.extend({ required: true });
      }

      var submitTest = function (test) {
          var promise = $.post("api/test/submittest", test).done(function (answer) {
              log('Test submited!', answer, true);
          });
          return promise;
      };

      var saveTest = function (test) {
          var promise = $.post("api/test/savetest", test).done(function (answer) {
              log('Test saved!', answer, true);
          });
          return promise;
      };

      var cancelChanges = function () {
          manager.rejectChanges();
          //log('Canceled changes', null, true);
      };

      var saveChanges = function () {
          return manager.saveChanges()
              .then(saveSucceeded)
              .fail(saveFailed);

          function saveSucceeded(saveResult) {
              log('Saved data successfully', saveResult, true);
              return saveData;
          }

          function saveFailed(error) {

              if (error.entityErrors[0].errorMessage == "success")
                  return error.entityErrors[0].errorMessage;

              var msg = 'Save failed: <br />' + getErrorMessages(error);
              msg = msg.replace(/,,/gi, '');
              msg = msg.replace(/,/gi, '');
              logError(msg, error);
              error.message = msg;
              throw error;
          }
      };

      var getAuthInfo = function () {
          return appsecurity.getAuthInfo()
                .then(getSucceeded)
                .fail(getFailed);

          function getSucceeded(authinfo)
          {
              appsecurity.user(authinfo);
              //log('Auth info succeeded', authinfo, true);
          }

          function getFailed(error) {
              var msg = 'Save failed: ' + error.message;
              logError(msg, error);
              error.message = msg;
              throw error;
          }
      };

      var primeData = function (app) {
          var promise = Q.all([getLookups(), getUsers(), getAuthInfo()])
                            .then(applyValidators);

          return promise.then(success);

          function success() {
              datacontext.lookups = {
                  userRoles: getLocal('UserRoles', 'roleName'),
                  statistics: getLocal('Statistics', 'startDate'),
                  testRestrictions: getLocal('TestRestrictions', 'id'),
                  questionTypes: getLocal('QuestionTypes', 'description'),
              };
              //log('Primed data', datacontext.lookups);
          };

          function applyValidators() {
              model.applyTestValidators(manager.metadataStore);
              model.applyTestRestrictionValidators(manager.metadataStore);
              model.applyAnswerValidators(manager.metadataStore);
              model.applyQuestionValidators(manager.metadataStore);
              model.applyQuestionTypeValidators(manager.metadataStore);
          }
      };

      var hasChanges = ko.observable(false);

      manager.hasChangesChanged.subscribe(function (eventArgs) {
          hasChanges(eventArgs.hasChanges);
      });

      var datacontext = {
          getTests: getTests,
          getOwnersFromTests: getOwnersFromTests,
          getUsers: getUsers,
          getTestById: getTestById,
          getUserById: getUserById,
          getQuestionsByTestId: getQuestionsByTestId,
          getTestDetails: getTestDetails,
          getUserTests: getUserTests,
          getQuestionTypes: getQuestionTypes,
          createEntity: createEntity,
          createTestEntity:createTestEntity,
          primeData: primeData,
          cancelChanges: cancelChanges,
          hasChanges: hasChanges,
          saveChanges: saveChanges,
          getAuthInfo: getAuthInfo,
          saveTestEntity: saveTestEntity,
          submitTest: submitTest,
          saveTest: saveTest,
          extendEntities: extendEntities,
          log: log
      };

      return datacontext;

      //дополнительные методы
      function configureBreezeManager() {
          breeze.NamingConvention.camelCase.setAsDefault();
          var mgr = new breeze.EntityManager(config.remoteServiceName);
          model.configureMetadataStore(mgr.metadataStore);
          return mgr;
      }

      function getLocal(resource, ordering) {
          var query = EntityQuery.from(resource)
              .orderBy(ordering);

          return manager.executeQueryLocally(query);
      }


      function getErrorMessages(error) {
          var msg = error.message;
          if (msg.match(/validation error/i)) {
              return getValidationMessages(error);
          }
          return msg;
      }

      function getValidationMessages(error) {
          try {
              return error.entityErrors.map(function (entity) {
                  if (entity.errorMessage.match(/Missing/i))
                      return entity.errorMessage + "<br />";
              });
          }
          catch (e) { }
          return 'validation error';
      }

      function getLookups() {
          return EntityQuery.from('Lookups')
              .using(manager).execute()
              .fail(queryFailed);
      }

      function queryFailed(error) {
          var msg = 'Error retreiving data. ' + error.message;
          logger.logError(msg, error, system.getModuleId(datacontext), true);
      }

      function log(msg, data, showToast) {
          logger.log(msg, data, system.getModuleId(datacontext), showToast);
      }

      function logError(msg, error) {
          logger.logError(msg, error, system.getModuleId(datacontext), true);
      }
  });
