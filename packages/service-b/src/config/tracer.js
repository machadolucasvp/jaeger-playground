const initJaegerTracer = require("jaeger-client").initTracer;

let instance

const getTracer = (serviceName) => {
    if(instance) return instance

    const config = {
      serviceName: serviceName,
      sampler: {
        type: "const",
        param: 1,
      },
      reporter: {
        logSpans: true,
      },
    }
    const options = {
      logger: {
        info: function logInfo(msg) {
          console.log("INFO ", msg);
        },
        error: function logError(msg) {
          console.log("ERROR", msg);
        },
      },
    }
    instance = initJaegerTracer(config, options)
    return instance
  }

  module.exports = { getTracer }