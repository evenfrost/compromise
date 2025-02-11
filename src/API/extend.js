const isObject = function (item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// recursive merge of objects
function mergeDeep(model, plugin) {
  if (isObject(plugin)) {
    for (const key in plugin) {
      if (isObject(plugin[key])) {
        if (!model[key]) Object.assign(model, { [key]: {} })
        mergeDeep(model[key], plugin[key]) //recursion
        // } else if (isArray(plugin[key])) {
        // console.log(key)
        // console.log(model)
      } else {
        Object.assign(model, { [key]: plugin[key] })
      }
    }
  }
  return model
}
// const merged = mergeDeep({ a: 1 }, { b: { c: { d: { e: 12345 } } } })
// console.dir(merged, { depth: 5 })

// vroom
function mergeQuick(model, plugin) {
  for (const key in plugin) {
    model[key] = model[key] || {}
    Object.assign(model[key], plugin[key])
  }
  return model
}

const addIrregulars = function (model, conj) {
  let m = model.two.models || {}
  Object.keys(conj).forEach(k => {
    // verb forms
    if (conj[k].pastTense) {
      if (m.toPast) {
        m.toPast.exceptions[k] = conj[k].pastTense
      }
      if (m.fromPast) {
        m.fromPast.exceptions[conj[k].pastTense] = k
      }
    }
    if (conj[k].presentTense) {
      if (m.toPresent) {
        m.toPresent.exceptions[k] = conj[k].presentTense
      }
      if (m.fromPresent) {
        m.fromPresent.exceptions[conj[k].presentTense] = k
      }
    }
    if (conj[k].gerund) {
      if (m.toGerund) {
        m.toGerund.exceptions[k] = conj[k].gerund
      }
      if (m.fromGerund) {
        m.fromGerund.exceptions[conj[k].gerund] = k
      }
    }
    // adjective forms
    if (conj[k].comparative) {
      if (m.toComparative) {
        m.toComparative.exceptions[k] = conj[k].comparative
      }
      if (m.fromComparative) {
        m.fromComparative.exceptions[conj[k].comparative] = k
      }
    }
    if (conj[k].superlative) {
      if (m.toSuperlative) {
        m.toSuperlative.exceptions[k] = conj[k].superlative
      }
      if (m.fromSuperlative) {
        m.fromSuperlative.exceptions[conj[k].superlative] = k
      }
    }
  })
}

const extend = function (plugin, world, View, nlp) {
  const { methods, model, compute, hooks } = world
  if (plugin.methods) {
    mergeQuick(methods, plugin.methods)
  }
  if (plugin.model) {
    mergeDeep(model, plugin.model)
  }
  if (plugin.irregulars) {
    addIrregulars(model, plugin.irregulars)
  }
  // shallow-merge compute
  if (plugin.compute) {
    Object.assign(compute, plugin.compute)
  }
  // append new hooks
  if (hooks) {
    world.hooks = hooks.concat(plugin.hooks || [])
  }
  // assign new class methods
  if (plugin.api) {
    plugin.api(View)
  }
  if (plugin.lib) {
    Object.keys(plugin.lib).forEach(k => nlp[k] = plugin.lib[k])
  }
  if (plugin.tags) {
    nlp.addTags(plugin.tags)
  }
  if (plugin.words) {
    nlp.addWords(plugin.words)
  }
  if (plugin.mutate) {
    plugin.mutate(world)
  }
}
export default extend
