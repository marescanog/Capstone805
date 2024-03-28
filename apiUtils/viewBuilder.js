class ViewBuilder {
    constructor(params){
        this.viewOptions = {
            layout:"main"
        }

        if(params.alertToLogin == true){
            this.viewOptions.alertToLogin = true;
        }

        if(params.userType){
            this.viewOptions.userType = params.userType;
        }
    }

    getOptions() {
        return this.viewOptions;
    }

}

module.exports = ViewBuilder;