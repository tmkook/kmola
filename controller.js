module.exports = class controller {
    model = null;
    context = null;
    primaryKey = 'id';
    constructor(context) {
        this.context = context;
        this.view = require('./view');
    }

    /**
     * 分页数据
     * @param {model} model 
     * @param {json} query 
     * @param {json} filter 
     * @returns 
     */
    async paginate(model, query, filter = {}) {
        filter.start_time = 'gt';
        filter.end_time = 'lt';
        filter.title = 'like';
        filter.page = 'no';
        filter.perpage = 'no';
        filter.with_trashed = 'with_trashed';
        filter.only_trashed = 'only_trashed';
        for (let key in query) {
            switch (filter[key]) {
                case 'gt':
                    model = model.where(key, '>', query[key]);
                    break;
                case 'lt':
                    model = model.where(key, '<', query[key]);
                    break;
                case 'like':
                    model = model.where(key, 'like', '%' + query[key] + '%');
                    break;
                case '-like':
                    model = model.where(key, 'like', '%' + query[key]);
                    break;
                case 'like-':
                    model = model.where(key, 'like', query[key] + '%');
                    break;
                case 'with_trashed':
                    model = model.withTrashed();
                    break;
                case 'only_trashed':
                    model = model.onlyTrashed();
                    break;
                case 'no':
                    break;
                default:
                    model = model.where(key, query[key]);
            }
        }
        return await model.paginate(query.page || 1, query.perpage || 20);
    }

    /**
     * 表格
     * @param {object} context 
     * @returns 
     */
    async grid(context) {
        let result = await this.paginate(this.model, context.query);
        return this.view.success(result);
    }

    /**
     * 详情
     * @param {object} context 
     * @returns 
     */
    async show(context) {
        let result = await this.model.where(this.primaryKey, context.params.id).first();
        return result ? this.view.success(result) : this.view.error('data not found', 404);
    }

    /**
    * 创建
    * @param {object} context 
    * @returns 
    */
    async create(context) {
        let result = await this.model.create(context.body);
        return this.view.success(result);
    }

    /**
    * 更新
    * @param {object} context 
    * @returns 
    */
    async update(context) {
        let id = context.body.id ? context.body.id : context.params.id;
        let result = await this.model.where(this.primaryKey, id).update(context.body);
        return this.view.success(result);
    }

    /**
    * 表单
    * @param {object} context 
    * @returns 
    */
    async form(context) {
        return context.body.id ? this.update(context) : this.create(context);
    }

    /**
    * 删除
    * @param {object} context 
    * @returns 
    */
    async delete(context) {
        let result = await this.model.whereIn(this.primaryKey, context.query.id.split(',')).delete();
        return this.view.success(result);
    }
}