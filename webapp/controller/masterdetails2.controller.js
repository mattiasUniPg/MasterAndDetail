sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/routing/History",
    'sap/ui/model/odata/v2/ODataModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageBox, JSONModel, Fragment, Spreadsheet, History, ODataModel) {
        "use strict";

        return Controller.extend("masterdetails2.controller.masterdetails2", {
            onInit: function () {

                //richiamo model inizio pagina
                this.getView().setModel(new JSONModel({}), "modelFilterHome");
                console.log(this.getView().getModel("modelFilterHome").getData());

                this._readMethod();

                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // // sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.getRoute("VisUtenti").attachPatternMatched(this._onObjectMatched, this);
                
            },
            
            // onObjectMatched: function() {
            //     // Recupera i dati passati dalla vista precedente
            //     var oSelectedData = this.getView().getModel("modelSelected").getProperty("/Id");
            
            //     // Ora hai i dati dell'elemento selezionato, puoi utilizzarli nella vista di destinazione come desiderato
            // },

            //###SPLIT###//

            onPressNavToDetail: function () {
                this.getSplitAppObj().to(this.createId("detailDetail"));
            },

            onPressDetailBack: function () {
                this.getSplitAppObj().backDetail();
            },

            onPressMasterBack: function () {
                this.getSplitAppObj().backMaster();
            },

            onPressGoToMaster: function () {
                this.getSplitAppObj().toMaster(this.createId("master2"));
            },

            onListItemPress: function (oEvent) {
                var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

                this.getSplitAppObj().toDetail(this.createId(sToPageId));
            },

            onPressModeBtn: function (oEvent) {
                var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

                this.getSplitAppObj().setMode(sSplitAppMode);
                MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
            },

            getSplitAppObj: function () {
                var result = this.byId("SplitAppDemo");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },

            //###SPLIT####//

            //Creazione MODEL E REGISTRAZIONE UTENTI
            onCreate: function () {
                //creazione del parametro obbligatorio dell' istanza oDataModel e' URL del servizio 
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_ACADEMY_SRV");
                var sEntity = "/z_rubricaSet";
                //oModel = new sap.ui.model.odata.v2.ODataModel({ serviceUrl: "http://195.231.25.136:8000/sap/opu/odata/sap/Z_ACADEMY_SRV/" });

                //http://195.231.25.136:8000/sap/opu/odata/sap/Z_ACADEMY_SRV/z_rubricaSet/$metadata URL ACCESSO JSON
                //Accedere a un file JSON di metadati del servizio con il metodo getServiceMetadata() su un modello Odata
                //Creazione entita del modello nome cognome email
                // var Id = this.getView().byId("Id").getValue();
                var Nome = this.getView().byId("Nome").getValue();
                var Cognome = this.getView().byId("Cognome").getValue();
                var Email = this.getView().byId("Email").getValue();
                var Telefono = this.getView().byId("Telefono").getValue();
                var Paese = this.getView().byId("Paese").getValue();
                var Citta = this.getView().byId("Citta").getValue();
                var Provincia = this.getView().byId("Provincia").getValue();
                var Indirizzo = this.getView().byId("Indirizzo").getValue();

                var flag = false;

                if (Nome == "" || Nome == undefined) {
                    MessageBox.error("Inserire Nome per registrare");
                    MessageBox.error.message;
                    flag = true;
                }
                if (Cognome == "" || Cognome == undefined) {
                    MessageBox.error("Inserire Cognome per registrare");
                    MessageBox.error.message;
                    flag = true;
                }

                if (!flag) {
                    var oData = {
                        "Nome": Nome,
                        "Cognome": Cognome,
                        "Email": Email,
                        "Telefono": Telefono,
                        "Paese": Paese,
                        "Citta": Citta,
                        "Provincia": Provincia,
                        "Indirizzo": Indirizzo

                    }
                    console.log(oData)
                    oModel.create(sEntity, oData, {
                        success: function (res) {
                            MessageBox.success("Registrazione con successo");
                            // var oBusyDialog = this.byId("busyDialog");
                            // oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
                            // setTimeout(function () {
                            //     oBusyDialog.close();
                            // }.bind(this), 1000);
                        },
                        error: function (err) {
                            MessageBox.error("Registrazione non avvenuta");
                            MessageBox.err.message;
                            console.log(err)
                        }
                    });
                }
            },

            oReset: function () {

                var oBusyDialog = this.byId("busyDialog");
                oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
                setTimeout(function () {
                    oBusyDialog.close();
                }.bind(this), 1000);

                var NomeINput = this.getView().byId("Nome");
                NomeINput.setValue("");
                var CognomeINput = this.getView().byId("Cognome");
                CognomeINput.setValue("");
                var EmailINput = this.getView().byId("Email");
                EmailINput.setValue("");
                var TelefonoINput = this.getView().byId("Telefono");
                TelefonoINput.setValue("");
                var PaeseINput = this.getView().byId("Paese");
                PaeseINput.setValue("");
                var CittaINput = this.getView().byId("Citta");
                CittaINput.setValue("");
                var ProvinciaINput = this.getView().byId("Provincia");
                ProvinciaINput.setValue("");
                var IndirizzoINput = this.getView().byId("Indirizzo");
                IndirizzoINput.setValue("");
            },

            //FINE REGISTRAZIONE

            //funzione searchfield
            onSearch: function (oEvt) {

                // aggiunge filtri searchfield
                var aFilters = [];
                var sQuery = oEvt.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("Nome", sap.ui.model.FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // aggiorna lista 
                var list = this.byId("idTable");
                var binding = list.getBinding("items");
                binding.filter(aFilters, "Application");
            },

            _readMethod: function () {   //read per restituire dati

                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_ACADEMY_SRV");
                var sEntity = "/z_rubricaSet";
                var oModelFilter = this.getView().getModel("modelFilterHome").getData();
                console.log(oModelFilter);
                var oView = this.getView();
                var oWner = this.getOwnerComponent();
                //1 CONDIZIONE MA NON ELENCA SE NON ENTRA PRIMA PARAMETRI
                var aFilter = [];

                if (!oModelFilter.Nome == "" || !oModelFilter.Nome == undefined) {
                    aFilter.push(new sap.ui.model.Filter("Nome", sap.ui.model.FilterOperator.EQ, oModelFilter.Nome));
                }
                if (!oModelFilter.Cognome == "" || !oModelFilter.Cognome == undefined) {
                    aFilter.push(new sap.ui.model.Filter("Cognome", sap.ui.model.FilterOperator.EQ, oModelFilter.Cognome));
                }

                var object = [];

                oModel.read(sEntity, {

                    filters: aFilter,
                    success: function (res) {
                        // this.onBack();
                        var byt = res.results;
                        console.log(byt)
                        byt.forEach(element => {
                            var obj = {
                                "Id": element.Id,
                                "Nome": element.Nome,
                                "Cognome": element.Cognome,
                                "Email": element.Email,
                                "Telefono": element.Telefono,
                                "Paese": element.Paese,
                                "Citta": element.Citta,
                                "Provincia": element.Provincia,
                                "Indirizzo": element.Indirizzo
                            };
                            object.push(obj);
                        });
                        //dati da inserire in tabella
                        oWner.setModel(new JSONModel(object), "modelResult");
                        console.log(oWner.getModel("modelResult"))
                    },
                    error: function (err) {
                        var msg = err.message;
                        MessageBox.error(msg);
                        console.log(err)
                    }
                });
            },

            // _sSelected: function (oEvent) {    //RICHIAMA RECORD NELLA RIGA SELEZIONATA NEL NUOVO MODEL    
                
            //     //1) VISTA IN SELEZIONE ID DEI ODATA
            //     var oPages = sap.ui.core.UIComponent.getRouterFor(this);

            //     //2) Ottenere la tabella dallo stato della view
            //     var oTable = this.byId("idTable");

            //     var sRecSelected = this.getView().byId("idTable").getBindingContext("modelResult").getObject();
            //     console.log(sRecSelected);
            //     //MODEL GLOBALE PeER APPOGGIARE DATI MODIFICATI FILTRATI CON IL PROPRIO ID
            //     var SelectedModel = this.getOwnerComponent().setModel(new JSONModel(sRecSelected), "modelSelected");

            //     //3) Ottenere l'oggetto del modello associato alla riga selezionata
    
            //     // // //4) Ottenere l'ID della riga selezionata
    
            //     var oBusyDialog = this.byId("busyDialog");
            //     oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
            //     setTimeout(function () {
            //         oBusyDialog.close();
            //     }.bind(this), 1000);
            //     console.log(SelectedModel)
            //     //5) Navigare alla pagina di dettaglio passando l'ID della riga selezionata come parametro
            //     oPages.navTo("VisUtenti", {
            //         Id: sRecSelected.Id
            //     });

            // },

            // onRowSelection: function (oEvent) {

            //     //1) VISTA IN SELEZIONE ID DEI ODATA
            //     var oPages = sap.ui.core.UIComponent.getRouterFor(this);

            //     //2) Ottenere la tabella dallo stato della view
            //     var oTable = this.byId("idTable");
            //     var List = this.byId("ColumnListItem");
            //     oEvent.getSource().getBindingContext('modelResult').getObject();

            //     var oRowSelected = this.getView().byId("ColumnListItem").getSelectedItem().getBindingContext("modelResult").getObject();
            //     var sSelectedModel = this.getOwnerComponent().setModel(new JSONModel(sRecSelected), "modelSelected");

            //     var oItem = oEvent.getParameter("arguments");

                
            //     var isChecked = (oEvent.getParameter("selected"));
            //     var oRowContext = oEvent.getSource().getBindingContext();
            //     // Ottieni i dati relativi alla riga selezionata
            //     var oData = oRowContext.getProperty();
            //     if (isChecked) {
            //         console.log("Riga selezionata:", oData);
            //     } else {
            //         console.log("Riga deselezionata:", oData);
            //     }

            //     var oSelectedItem = oEvent.getSource().getBindingContext("modelResult").getObject();
            //     this.oRowContext.getModel().setData(oSelectedItem);

            //     oPages.navTo("VisUtenti", {
            //         Id: oRowSelected.Id
            //     });
            // },
        
            onSelectedListItemPress: function(oEvent) {
                
                // var oRoute = sap.ui.core.UIComponent.getRouterFor(this);

                // var oItem = oEvent.getSource();
                //     var oBindingContext = oItem.getBindingContext("modelResult");
                //     var sPath = oBindingContext.getPath();
                //     var sId = sPath.split("/").pop(); // Assumendo che l'ID sia l'ultimo segmento del percorso
                // console.log(oItem, oBindingContext, sPath, sId)    
                //     oRoute.navTo("VisUtenti", {
                //         id: sId
                //     });
                
                var oItem = oEvent.getSource();
                var oBindingContext = oItem.getBindingContext("modelResult");
                var sPath = oBindingContext.getPath();
                var oSelectedData = oBindingContext.getProperty(sPath);
                console.log(oSelectedData)
                // Passa i dati alla nuova vista usando un set di proprietà
                // this.getView().getModel("modelDestination").setProperty("/selectedItem", oSelectedData);
                this.getView().setModel(new JSONModel(oSelectedData), "modelSelected");
                console.log(this.getView().getModel("modelSelected").getData())

                // Naviga alla nuova vista
                // this.getRouter().navTo("detail");

            },

            //MODIFICA INIZIO

            Updating: function () { //NAVIGA HOME CON ROW FILTRATA ID IN PAGE MODIFICA

                //1) VISTA IN SELEZIONE ID DEI ODATA
                var oPages = sap.ui.core.UIComponent.getRouterFor(this);

                //2) Ottenere la tabella dallo stato della view
                var oTable = this.byId("idTable");

                var sRecSelected = this.getView().byId("idTable").getSelectedItem().getBindingContext("modelResult").getObject();
                console.log(sRecSelected);
                //MODEL GLOBALE PeER APPOGGIARE DATI MODIFICATI FILTRATI CON IL PROPRIO ID
                var SelectedModel = this.getOwnerComponent().setModel(new JSONModel(sRecSelected), "modelSelected");

                var oBusyDialog = this.byId("busyDialog");
                oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
                setTimeout(function () {
                    oBusyDialog.close();
                }.bind(this), 1000);
                console.log(SelectedModel)

                //5) Navigare alla pagina di dettaglio passando l'ID della riga selezionata come parametro
                oPages.navTo("Modifica", {
                    Id: sRecSelected.Id
                });

            },

            Modifica: function (oEvent) {

                var oModel = this.getOwnerComponent().getModel("modelSelected");
                console.log(oModel)

                var onModify = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_ACADEMY_SRV");
                var sSelectedId = oModel.getProperty("/Id");
                var sEntity = "/z_rubricaSet('" + sSelectedId + "')";
                var that = this;

                var Nome = this.getView().byId("NomeUpd").getValue();
                var Cognome = this.getView().byId("CognomeUpd").getValue();
                var Email = this.getView().byId("EmailUpd").getValue();
                var Telefono = this.getView().byId("TelefonoUpd").getValue();
                var Paese = this.getView().byId("PaeseUpd").getValue();
                var Citta = this.getView().byId("CittaUpd").getValue();
                var Provincia = this.getView().byId("ProvinciaUpd").getValue();
                var Indirizzo = this.getView().byId("IndirizzoUpd").getValue();

                console.log(Nome, Cognome, Email, Telefono, Paese, Citta, Provincia, Indirizzo)

                this.getOwnerComponent().getModel("modelSelected").setProperty("/Nome", Nome);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Cognome", Cognome);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Email", Email);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Telefono", Telefono);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Paese", Paese);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Citta", Citta);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Provincia", Provincia);
                this.getOwnerComponent().getModel("modelSelected").setProperty("/Indirizzo", Indirizzo);

                
                if (Nome == "" || Cognome == "" || Telefono.length != 10) {
                    MessageBox.error("Inserire campi nome cognome telefono");
                    flag = true;
                }

                var oData = {

                    "Nome": Nome,
                    "Cognome": Cognome,
                    "Email": Email,
                    "Telefono": Telefono,
                    "Paese": Paese,
                    "Citta": Citta,
                    "Provincia": Provincia,
                    "Indirizzo": Indirizzo
                
                }

                onModify.update(sEntity, oData, {
                    merge: false,
                    success: function (res) {
                        console.log(res)
                        MessageBox.success("Modifica parametri effettuata");
                        that.onBack();
                    },
                    error: function (err) {
                        var mes = err.message;

                        MessageBox.error(mes);
                        console.log(err)
                    }
                });

            },

            //FINE MODIFICA
            onBack: function () {

                var oBusyDialog = this.byId("busyDialog");
                oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
                setTimeout(function () {
                    oBusyDialog.close();
                    {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("VisUtenti", {}, true);
                    }
                }.bind(this), 1000);
            },
            //CONFIGURAZIONE COLONNE DA IMPLEMENTARE IN UN FILE EXCL
            createColumnConfig: function () {
                var aCols = [];
                aCols.push({
                    label: 'Nome Cognome',
                    property: ['Nome', 'Cognome'],
                    type: 'string',
                    template: '{0}, {1}'
                });
                aCols.push({
                    label: 'Id',
                    type: 'number',
                    property: 'Id',
                    scale: 0
                });
                aCols.push({
                    property: 'Nome',
                    type: 'string'
                });
                aCols.push({
                    property: 'Cognome',
                    type: 'string'
                });
                aCols.push({
                    property: 'Email',
                    type: 'string'
                });
                aCols.push({
                    property: 'Telefono',
                    type: 'number'

                });
                aCols.push({
                    property: 'Paese',
                    type: 'string'
                });
                aCols.push({
                    property: 'Citta',
                    type: 'string'
                });
                aCols.push({
                    property: 'Provincia',
                    type: 'string'
                });
                aCols.push({
                    property: 'Indirizzo',
                    type: 'string'
                });

                return aCols;
            },

            //CANCELLA RECORD TABELLA
            Cancella: function (oEvent) {

                var oModel = this.getOwnerComponent().getModel("modelSelected");
                //RICHIAMO IL MODEL DA PRENDERE PER ELEMENTO ID
                var oModelRemove = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z_ACADEMY_SRV");
                var sSelectedId = oModel.getProperty("/Id");
                console.log(sSelectedId)
                var sEntity = "/z_rubricaSet('" + sSelectedId + "')";

                //OPERATION CRUD DELETE IN BASE ELEMENTO IN ENTITY
                oModelRemove.remove(sEntity, {
                    success: function (res) {

                        MessageBox.success(

                            "Utente cancellato con successo!",
                        );
                    },
                    error: function (error) {
                        MessageBox.error("Cancellazioni non effettuata");
                    }
                });
    
                this.oDialog.exit();
                this.oDialog.destroy();
            },

            //FINE DELETE

            onExport: function () {
                var aCols, oBinding, oSettings, oSheet, oTable;
                
                var oModel = this.getView().getModel("modelResult").getData();
                console.log(oModel.length)

                if (!this._oTable) {
                    this._oTable = this.byId('idTable');
                }
                oTable = this._oTable
                oBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
                //BUSY DIALOG
                var oBusyDialog = this.byId("busyDialog");
                oBusyDialog.open(); // Mostra il busy dialog prima del reindirizzamento
                setTimeout(function () {
                    oBusyDialog.close();
                }.bind(this), 1000);

                oSettings = {
                    workbook: { columns: aCols, hierarchyLevel: 'Level' },
                    dataSource: oModel,
                    fileName: 'REPORT SAP.xlsx',
                    worker: false,
                    count: oModel.length || 50
                };

                //new Spreadsheet(oSettings).build()
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
        });
    });