console.log("setup.js")
module.exports = {
    id: 'visit_time_limit',
    name: 'Visitor time limit',
    description: 'Set how long visitors are allowed to stay on prmises',
    fields: [
      {
        id: 'max_minutes',
        name: 'Maximum minutes on premises',
        type: 'number',
        required: true,
        min: 0,
        max: 180,
        description: 'Enter a value between 0 and 180'
      }
    ]
  };
  